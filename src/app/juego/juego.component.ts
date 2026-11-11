import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComidasService } from '../servicios/comidas.service';
import { BebidasService } from '../servicios/bebidas.service';

@Component({
  selector: 'app-juego',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './juego.component.html',
  styleUrl: './juego.component.css'
})
export class JuegoComponent implements OnInit {

  constructor(
    private comidasService: ComidasService,
    private bebidasService: BebidasService
  ) { }

  plato: any;
  bebida: any;

  // MATRIZ DE 4 FILAS Y 4 COLUMNAS
  tarjetas: any[][] = [];

  mensaje: string = 'Encuentra el plato y la bebida.';
  juegoIniciado: boolean = false;
  juegoTerminado: boolean = false;

  ngOnInit(): void {
    this.cargarJuego();
  }

  cargarJuego() {

    Promise.all([
      this.comidasService.mostrarPorCategoria('Beef'),
      this.bebidasService.mostrarPorCategoria('Ordinary Drink')
    ])
    .then(([comidas, bebidas]) => {

      let listaComidas = comidas.meals;
      let listaBebidas = bebidas;

      let comidasSeleccionadas = listaComidas
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);

      let bebidasSeleccionadas = listaBebidas
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);

      this.plato = comidasSeleccionadas[
        Math.floor(Math.random() * comidasSeleccionadas.length)
      ];

      this.bebida = bebidasSeleccionadas[
        Math.floor(Math.random() * bebidasSeleccionadas.length)
      ];

      let tarjetasMezcladas = [

        ...comidasSeleccionadas.map((comida: any) => ({
          imagen: comida.strMealThumb,
          tipo: 'comida',
          descubierta: false,
          encontrada: false
        })),

        ...bebidasSeleccionadas.map((bebida: any) => ({
          imagen: bebida.strDrinkThumb,
          tipo: 'bebida',
          descubierta: false,
          encontrada: false
        }))

      ];

      // MEZCLAR LAS 16 TARJETAS
      tarjetasMezcladas.sort(() => Math.random() - 0.5);

      // ORGANIZAR LAS TARJETAS EN UNA MATRIZ 4 X 4
      this.tarjetas = [
        tarjetasMezcladas.slice(0, 4),
        tarjetasMezcladas.slice(4, 8),
        tarjetasMezcladas.slice(8, 12),
        tarjetasMezcladas.slice(12, 16)
      ];

      this.juegoIniciado = true;

    })
    .catch(error => {
      console.error('Error al cargar el juego:', error);
      this.mensaje = 'No fue posible cargar las imágenes.';
    });

  }

  descubrirTarjeta(tarjeta: any) {

    if (tarjeta.descubierta || this.juegoTerminado) {
      return;
    }

    tarjeta.descubierta = true;

    if (
      tarjeta.tipo === 'comida' &&
      tarjeta.imagen === this.plato.strMealThumb
    ) {
      tarjeta.encontrada = true;
      this.mensaje = '¡Encontraste el plato!';
    }

    else if (
      tarjeta.tipo === 'bebida' &&
      tarjeta.imagen === this.bebida.strDrinkThumb
    ) {
      tarjeta.encontrada = true;
      this.mensaje = '¡Encontraste la bebida!';
    }

    else {
      this.mensaje = '¡Aquí no hay nada! ❌';
    }

    let platoEncontrado = this.tarjetas.some(
      fila => fila.some(
        t => t.tipo === 'comida' && t.encontrada
      )
    );

    let bebidaEncontrada = this.tarjetas.some(
      fila => fila.some(
        t => t.tipo === 'bebida' && t.encontrada
      )
    );

    if (platoEncontrado && bebidaEncontrada) {

      this.juegoTerminado = true;
      this.mensaje = '¡FELICIDADES! ¡GANASTE EL JUEGO!';

    }

  }

  reiniciarRonda() {

    let tarjetasMezcladas: any[] = [];

    // RECORRER LA MATRIZ Y OCULTAR LAS TARJETAS
    this.tarjetas.forEach(fila => {
      fila.forEach(tarjeta => {

        tarjeta.descubierta = false;
        tarjeta.encontrada = false;

        tarjetasMezcladas.push(tarjeta);

      });
    });

    // CAMBIAR LAS POSICIONES
    tarjetasMezcladas.sort(() => Math.random() - 0.5);

    // VOLVER A ORGANIZAR LA MATRIZ 4 X 4
    this.tarjetas = [
      tarjetasMezcladas.slice(0, 4),
      tarjetasMezcladas.slice(4, 8),
      tarjetasMezcladas.slice(8, 12),
      tarjetasMezcladas.slice(12, 16)
    ];

    this.juegoTerminado = false;
    this.mensaje = '¡Nueva ronda! Encuentra nuevamente el plato y la bebida.';

  }

}