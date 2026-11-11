import { jsPDF } from 'jspdf';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Pedido } from '../entidades/pedido';
import { CompartirComidasService } from '../servicios/compartir-comidas.service';
import { CompartirBebidasService } from '../servicios/compartir-bebidas.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pedido.component.html',
  styleUrl: './pedido.component.css'
})
export class PedidoComponent {

  // OBJETO DE LA CLASE PEDIDO

  pedido: Pedido = new Pedido();

  constructor(
    private compartirComidas: CompartirComidasService,
    private compartirBebidas: CompartirBebidasService
  ) {

    // RECUPERAR LOS DATOS DEL CLIENTE

    let datosGuardados = this.compartirComidas.pedidoSignal();

    if (datosGuardados) {
      this.pedido = Object.assign(this.pedido, datosGuardados);
    }

  }


  // GUARDAR LOS DATOS DEL CLIENTE

  guardarDatosCliente() {

    this.compartirComidas.enviarPedido(this.pedido);

  }


  // OBTENER LOS PRODUCTOS SELECCIONADOS

  get productosSeleccionados(): any[] {

    return [
      ...this.compartirComidas.comidasSignal(),
      ...this.compartirBebidas.bebidasSignal()
    ];

  }


  // CALCULAR EL TOTAL

  get total(): number {

    let total = 0;

    this.productosSeleccionados.forEach(producto => {

      total += producto.precio * producto.cantidad;

    });

    return total;

  }


  // AUMENTAR CANTIDAD

  mas(producto: any) {

    producto.cantidad++;

    if (producto.idMeal) {

      let comidas = this.compartirComidas.comidasSignal()
        .map(comida => ({ ...comida }));

      this.compartirComidas.actualizarComidas(comidas);

    } else {

      let bebidas = this.compartirBebidas.bebidasSignal()
        .map(bebida => ({ ...bebida }));

      this.compartirBebidas.actualizarBebidas(bebidas);

    }

  }


  // DISMINUIR CANTIDAD

  menos(producto: any) {

    if (producto.cantidad > 1) {

      producto.cantidad--;

      if (producto.idMeal) {

        let comidas = this.compartirComidas.comidasSignal()
          .map(comida => ({ ...comida }));

        this.compartirComidas.actualizarComidas(comidas);

      } else {

        let bebidas = this.compartirBebidas.bebidasSignal()
          .map(bebida => ({ ...bebida }));

        this.compartirBebidas.actualizarBebidas(bebidas);

      }

    }

  }


  // ELIMINAR PRODUCTO

  eliminar(producto: any) {

    if (producto.idMeal) {

      let comidas = this.compartirComidas.comidasSignal()
        .filter(comida => comida.idMeal != producto.idMeal);

      this.compartirComidas.actualizarComidas(comidas);

    } else {

      let bebidas = this.compartirBebidas.bebidasSignal()
        .filter(bebida => bebida.idDrink != producto.idDrink);

      this.compartirBebidas.actualizarBebidas(bebidas);

    }

  }


  // GENERAR PDF DEL PEDIDO

  async generarPDF() {

    if (
      this.pedido.nombre.trim() == '' ||
      this.pedido.telefono.trim() == '' ||
      this.pedido.direccion.trim() == ''
    ) {

      alert('Debes completar los datos del cliente.');
      return;

    }

    if (this.productosSeleccionados.length == 0) {

      alert('Debes seleccionar al menos un producto.');
      return;

    }

    // GUARDAR LOS DATOS DEL CLIENTE

    this.guardarDatosCliente();

    try {

      let pdf = new jsPDF();

      // OBTENER EL LOGO

      let respuesta = await fetch('/assets/logo-manila.png');

      if (!respuesta.ok) {
        throw new Error('No se pudo cargar el logo.');
      }

      let imagen = await respuesta.blob();

      let lector = new FileReader();

      let logo = await new Promise<string>((resolve, reject) => {

        lector.onload = () => {
          resolve(lector.result as string);
        };

        lector.onerror = () => {
          reject(new Error('No se pudo leer el logo.'));
        };

        lector.readAsDataURL(imagen);

      });


      // ENCABEZADO

      pdf.addImage(logo, 'PNG', 75, 10, 60, 35);

      pdf.setFontSize(20);
      pdf.text('MANILA RESTAURANTE', 105, 55, { align: 'center' });

      pdf.setFontSize(11);


      // FECHA

      let fecha = new Date().toLocaleDateString('es-CO');

      pdf.text('Fecha: ' + fecha, 20, 70);


      // DATOS DEL CLIENTE

      pdf.setFontSize(14);

      pdf.text('DATOS DEL CLIENTE', 20, 85);

      pdf.setFontSize(11);

      pdf.text('Nombre: ' + this.pedido.nombre, 20, 95);
      pdf.text('Celular: ' + this.pedido.telefono, 20, 103);
      pdf.text('Direccion: ' + this.pedido.direccion, 20, 111);


      // LISTA DE PRODUCTOS

      pdf.setFontSize(14);

      pdf.text('DETALLE DEL PEDIDO', 20, 128);

      pdf.setFontSize(10);

      let y = 140;

      pdf.text('PRODUCTO', 20, y);
      pdf.text('CANTIDAD', 105, y);
      pdf.text('PRECIO', 140, y);
      pdf.text('SUBTOTAL', 175, y);

      y += 8;


      this.productosSeleccionados.forEach(producto => {

        let nombre = producto.strMeal || producto.strDrink;
        let cantidad = producto.cantidad;
        let precio = producto.precio;
        let subtotal = precio * cantidad;

        pdf.text(nombre.substring(0, 35), 20, y);

        pdf.text(String(cantidad), 110, y);

        pdf.text('$' + precio.toLocaleString('es-CO'), 140, y);

        pdf.text('$' + subtotal.toLocaleString('es-CO'), 175, y);

        y += 10;

      });


      // TOTAL

      y += 8;

      pdf.setFontSize(14);

      pdf.text(
        'TOTAL A PAGAR: $' + this.total.toLocaleString('es-CO'),
        190,
        y,
        { align: 'right' }
      );


      // DESCARGAR PDF

      pdf.save('pedido-manila.pdf');

    } catch (error) {

      console.error('Error al generar el PDF:', error);

      alert('No se pudo generar el pedido. Verifica que el logo esté en la carpeta assets.');

    }

  }

}