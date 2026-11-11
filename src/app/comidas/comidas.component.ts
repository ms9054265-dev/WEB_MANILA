import { Component, OnInit, Input } from '@angular/core';
import { ComidasService } from '../servicios/comidas.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CompartirComidasService } from '../servicios/compartir-comidas.service';
import { Comidas } from '../entidades/comidas';

@Component({
  selector: 'app-comidas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comidas.component.html',
  styleUrl: './comidas.component.css'
})
export class ComidasComponent implements OnInit {

  @Input() titulo: string = 'comidas';
  @Input() categoria: string = '';

  // OBJETO DE LA CLASE COMIDAS

  comida: Comidas = new Comidas();

  lista: any[] = [];
  listaMostrar: any[] = [];
  categorias: any[] = [];

  vista: string = 'menu';

  // VENTANA DE COMPRA

  mostrarVentanaCompra: boolean = false;
  mensajeCompra: string = '';

  constructor(
    private comidasService: ComidasService,
    private compartirComidas: CompartirComidasService
  ) { }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  // TRAER MÁXIMO 24 COMIDAS

  obtenerDatos() {

    this.comidasService.mostrarDatos('a')
      .then((data: any) => {

        let comidas = (data.meals || []).slice(0, 24);

        this.lista = comidas.map((m: any) => ({
          ...m,
          precio: Math.floor(Math.random() * 21 + 10) * 1000,
          cantidad: 1
        }));

        this.listaMostrar = this.lista;

      })
      .catch(error => {
        console.error('Error al cargar las comidas:', error);
      });

  }

  // OBTENER LAS CATEGORÍAS DESDE LA API

  obtenerCategorias() {

    this.comidasService.mostrarCategorias()
      .then((data: any) => {

        let categoriasPermitidas = [
          'Beef',
          'Chicken',
          'Dessert',
          'Lamb',
          'Miscellaneous',
          'Pasta'
        ];

        this.categorias = data.categories.filter(
          (categoria: any) =>
            categoriasPermitidas.includes(categoria.strCategory)
        );

      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
      });

  }

  // MOSTRAR COMIDAS POR CATEGORÍA

  mostrarBeef(): void {
    this.comida.tipo = 'Beef';
    this.mostrarPorCategoria();
  }

  mostrarChicken(): void {
    this.comida.tipo = 'Chicken';
    this.mostrarPorCategoria();
  }

  mostrarDessert(): void {
    this.comida.tipo = 'Dessert';
    this.mostrarPorCategoria();
  }

  mostrarLamb(): void {
    this.comida.tipo = 'Lamb';
    this.mostrarPorCategoria();
  }

  mostrarMiscellaneous(): void {
    this.comida.tipo = 'Miscellaneous';
    this.mostrarPorCategoria();
  }

  mostrarPasta(): void {
    this.comida.tipo = 'Pasta';
    this.mostrarPorCategoria();
  }

  // CONSULTAR MÁXIMO 24 COMIDAS POR CATEGORÍA

  mostrarPorCategoria(categoria: string = ''): void {

    if (categoria == '') {
      categoria = this.comida.tipo.toString();
    }

    this.comida.tipo = categoria;

    this.titulo = 'Comidas ' + categoria;

    this.comidasService.mostrarPorCategoria(categoria)
      .then((data: any) => {

        let comidas = (data.meals || []).slice(0, 24);

        return this.obtenerDetalles(comidas);

      })
      .then((resultados: any[]) => {

        this.listaMostrar = resultados;

      })
      .catch(error => {
        console.error('Error al mostrar las comidas:', error);
      });

  }

  // OBTENER LOS DETALLES DE LAS COMIDAS

  obtenerDetalles(comidas: any[]): Promise<any[]> {

    return Promise.all(
      comidas.map(comida =>
        this.comidasService.mostrarDetalle(comida.idMeal)
      )
    ).then(resultados => {

      let completas: any[] = [];

      resultados.forEach(data => {

        if (data.meals) {

          completas.push({
            ...data.meals[0],
            precio: Math.floor(Math.random() * 21 + 10) * 1000,
            cantidad: 1
          });

        }

      });

      return completas;

    });

  }

  // BUSCAR POR NOMBRE

  buscarPorNombre() {

    if (this.comida.nombre.trim() == "") {

      this.listaMostrar = this.lista;
      this.titulo = 'comidas';

    } else {

      this.comidasService.mostrarDatos(this.comida.nombre.toString())
        .then((data: any) => {

          this.listaMostrar = (data.meals || [])
            .slice(0, 24)
            .map((comida: any) => ({
              ...comida,
              precio: Math.floor(Math.random() * 21 + 10) * 1000,
              cantidad: 1
            }));

          this.titulo = 'Resultados por nombre';

        })
        .catch(error => {
          console.error('Error al buscar por nombre:', error);
        });

    }

  }

  // BUSCAR POR INGREDIENTE

  buscarPorIngrediente() {

    if (this.comida.ingrediente.trim() == "") {

      this.listaMostrar = this.lista;
      this.titulo = 'comidas';

    } else {

      this.comidasService.mostrarIngredientes(this.comida.ingrediente.toString())
        .then((data: any) => {

          let comidas = (data.meals || []).slice(0, 24);

          return this.obtenerDetalles(comidas);

        })
        .then((resultados: any[]) => {

          this.listaMostrar = resultados;
          this.titulo = 'Resultados por ingrediente';

        })
        .catch(error => {
          console.error('Error al buscar por ingrediente:', error);
        });

    }

  }

  // OBTENER LOS INGREDIENTES DE CADA COMIDA

  ingredientes(comida: any): string {

    let lista: string[] = [];

    for (let i = 1; i <= 20; i++) {

      let ing = comida['strIngredient' + i];

      if (ing && ing.trim() != "") {
        lista.push(ing);
      }

    }

    return lista.join(', ');

  }

  // AUMENTAR CANTIDAD

  mas(comida: any) {
    comida.cantidad++;
  }

  // DISMINUIR CANTIDAD

  menos(comida: any) {

    if (comida.cantidad > 1) {
      comida.cantidad--;
    }

  }

  // COMPRAR COMIDA

  agregar(comida: any) {

    this.compartirComidas.agregarComida(comida);

    let total = comida.precio * comida.cantidad;

    this.mensajeCompra =
      'Agregaste ' + comida.cantidad +
      ' x ' + comida.strMeal +
      ' = $' + total.toLocaleString('es-CO');

    this.mostrarVentanaCompra = true;

  }

  // CERRAR VENTANA DE COMPRA

  cerrarVentanaCompra() {

    this.mostrarVentanaCompra = false;

  }

}