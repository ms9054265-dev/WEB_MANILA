import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ComidasService } from '../servicios/comidas.service';
import { BebidasService } from '../servicios/bebidas.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements OnInit {

  plato: any = null;
  bebida: any = null;

  constructor(
    private comidasService: ComidasService,
    private bebidasService: BebidasService
  ) { }

  ngOnInit(): void {
    this.obtenerPlato();
    this.obtenerBebida();
  }

  // OBTENER EL PLATO ESTRELLA

  obtenerPlato() {

    this.comidasService.mostrarDatos('Chicken Alfredo')
      .then((data: any) => {

        if (data.meals && data.meals.length > 0) {
          this.plato = data.meals[0];
        }

      })
      .catch(error => {
        console.error('Error al obtener el plato:', error);
      });

  }

  // OBTENER LA BEBIDA ESTRELLA

  obtenerBebida() {

    this.bebidasService.mostrarPorNombre('Strawberry Daiquiri')
      .then((data: any) => {

        let bebidas = data.drinks || data;

        if (bebidas && bebidas.length > 0) {
          this.bebida = bebidas[0];
        }

      })
      .catch(error => {
        console.error('Error al obtener la bebida:', error);
      });

  }

  // OBTENER INGREDIENTES DEL PLATO

  ingredientesPlato(plato: any): string {

    let lista: string[] = [];

    for (let i = 1; i <= 20; i++) {

      let ingrediente = plato['strIngredient' + i];

      if (ingrediente && ingrediente.trim() != '') {
        lista.push(ingrediente);
      }

    }

    return lista.join(', ');

  }

  // OBTENER INGREDIENTES DE LA BEBIDA

  ingredientesBebida(bebida: any): string {

    let lista: string[] = [];

    for (let i = 1; i <= 15; i++) {

      let ingrediente = bebida['strIngredient' + i];

      if (ingrediente && ingrediente.trim() != '') {
        lista.push(ingrediente);
      }

    }

    return lista.join(', ');

  }

}