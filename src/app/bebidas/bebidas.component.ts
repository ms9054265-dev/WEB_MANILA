import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BebidasService } from '../servicios/bebidas.service';
import { CompartirBebidasService } from '../servicios/compartir-bebidas.service';
import { Bebidas } from '../entidades/bebidas';

@Component({
  selector: 'app-bebidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bebidas.component.html',
  styleUrl: './bebidas.component.css'
})
export class BebidasComponent implements OnInit {

  // OBJETO DE LA CLASE BEBIDAS

  bebida: Bebidas = new Bebidas();

  listaMostrar: any[] = [];

  categorias: any[] = [];

  titulo: string = '';

  // VENTANA DE COMPRA

  mostrarVentanaCompra: boolean = false;

  mensajeCompra: string = '';

  constructor(
    private bebidasService: BebidasService,
    private compartirBebidas: CompartirBebidasService
  ) { }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  // ASIGNAR PRECIO Y CANTIDAD A LAS BEBIDAS

  prepararBebidas(bebidas: any[]) {

    this.listaMostrar = bebidas.slice(0, 24).map(b => ({
      ...b,
      precio: Math.floor(Math.random() * 21 + 10) * 1000,
      cantidad: 1
    }));

  }

  // MOSTRAR LOS RESULTADOS DE LAS BÚSQUEDAS

  mostrarLista(peticion: Promise<any>, titulo: string, consultarDetalles: boolean = true) {

    this.titulo = titulo;
    this.listaMostrar = [];

    peticion
      .then(data => {

        let bebidas = data || [];

        if (!consultarDetalles) {

          this.prepararBebidas(bebidas);

          return;

        }

        let consultas = bebidas.slice(0, 24).map((bebida: any) =>
          this.bebidasService.mostrarDetalle(bebida.idDrink)
        );

        return Promise.all(consultas);

      })
      .then(resultados => {

        if (!resultados) {
          return;
        }

        let completas: any[] = [];

        resultados.forEach((data: any) => {

          if (data.length > 0) {
            completas.push(data[0]);
          }

        });

        this.prepararBebidas(completas);

      })
      .catch(error => {

        console.error('Error al obtener las bebidas:', error);

      });

  }

  // BUSCAR BEBIDAS POR NOMBRE

  buscarPorNombre() {

    if (this.bebida.nombre.trim() == '') {

      return;

    }

    this.mostrarLista(
      this.bebidasService.mostrarPorNombre(this.bebida.nombre.toString()),
      'Resultados de la búsqueda',
      false
    );

  }

  // BUSCAR BEBIDAS POR INGREDIENTE

  buscarPorIngrediente() {

    if (this.bebida.ingrediente.trim() == '') {

      return;

    }

    this.mostrarLista(
      this.bebidasService.mostrarPorIngrediente(this.bebida.ingrediente.toString()),
      'Bebidas por ingrediente'
    );

  }

  // BUSCAR BEBIDAS POR TIPO DE ALCOHOL

  mostrarPorAlcohol(tipo: string) {

    this.bebida.tipo = tipo;

    if (this.bebida.tipo != '') {

      this.mostrarLista(
        this.bebidasService.mostrarPorAlcohol(this.bebida.tipo.toString()),
        'Bebidas por tipo'
      );

    }

  }

  // OBTENER LAS CATEGORÍAS Y SUS IMÁGENES

  obtenerCategorias() {

    this.bebidasService.mostrarCategorias()
      .then((data: any) => {

        let categorias = (data.drinks || data).filter(
          (categoria: any) =>
            [
              'Ordinary Drink',
              'Cocktail',
              'Shake',
              'Cocoa',
              'Coffee / Tea',
              'Soft Drink'
            ].includes(categoria.strCategory)
        );

        return Promise.all(
          categorias.map((categoria: any) =>

            this.bebidasService.mostrarPorCategoria(categoria.strCategory)
              .then((bebidas: any) => {

                let lista = bebidas.drinks || bebidas || [];

                return {
                  ...categoria,
                  imagen: lista.length > 0
                    ? lista[0].strDrinkThumb
                    : ''
                };

              })

          )
        );

      })
      .then((categorias: any) => {

        this.categorias = categorias;

      })
      .catch(error => {

        console.error('Error al obtener las categorías:', error);

      });

  }

  // BUSCAR BEBIDAS POR CATEGORÍA

  mostrarPorCategoria(categoria: string) {

    this.bebida.tipo = categoria;

    this.mostrarLista(
      this.bebidasService.mostrarPorCategoria(this.bebida.tipo.toString()),
      'Bebidas de la categoría ' + this.bebida.tipo
    );

  }

  // MOSTRAR LOS INGREDIENTES

  ingredientes(bebida: any) {

    let listaIngredientes: string[] = [];

    for (let i = 1; i <= 15; i++) {

      let ingrediente = bebida['strIngredient' + i];

      if (ingrediente != null && ingrediente.trim() != '') {
        listaIngredientes.push(ingrediente);
      }

    }

    return listaIngredientes.join(', ');

  }

  // AUMENTAR CANTIDAD

  mas(bebida: any) {
    bebida.cantidad++;
  }

  // DISMINUIR CANTIDAD

  menos(bebida: any) {

    if (bebida.cantidad > 1) {
      bebida.cantidad--;
    }

  }

  // COMPRAR BEBIDA

  Agregar(bebida: any) {

    this.compartirBebidas.agregarBebida(bebida);

    let total = bebida.precio * bebida.cantidad;

    this.mensajeCompra =
      'Agregaste ' + bebida.cantidad +
      ' x ' + bebida.strDrink +
      ' = $' + total.toLocaleString('es-CO');

    this.mostrarVentanaCompra = true;

  }

  // CERRAR VENTANA DE COMPRA

  cerrarVentanaCompra() {

    this.mostrarVentanaCompra = false;

  }

}