import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComidasService {

  constructor() { }

  private comidas = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
  private ingredientes = "https://www.themealdb.com/api/json/v1/1/filter.php?i=";
  private detalle = "https://www.themealdb.com/api/json/v1/1/lookup.php?i=";
  private categorias = "https://www.themealdb.com/api/json/v1/1/categories.php";
  private comidasCategoria = "https://www.themealdb.com/api/json/v1/1/filter.php?c=";


  // 1. BUSCAR COMIDAS POR NOMBRE

  mostrarDatos(comida: string) {
    return fetch(this.comidas + comida)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error al obtener las comidas:', error);
        throw error;
      });
  }


  // 2. BUSCAR COMIDAS POR INGREDIENTE

  mostrarIngredientes(ingrediente: string) {
    return fetch(this.ingredientes + ingrediente)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error al obtener las comidas por ingrediente:', error);
        throw error;
      });
  }


  // 3. OBTENER DETALLES DE UNA COMIDA

  mostrarDetalle(id: string) {
    return fetch(this.detalle + id)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error al obtener los detalles:', error);
        throw error;
      });
  }


  // 4. OBTENER LAS CATEGORÍAS

  mostrarCategorias() {
    return fetch(this.categorias)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
        throw error;
      });
  }


  // 5. BUSCAR COMIDAS POR CATEGORÍA

  mostrarPorCategoria(categoria: string) {
    return fetch(this.comidasCategoria + categoria)
      .then(response => response.json())
      .then(data => {
        console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error al obtener las comidas por categoría:', error);
        throw error;
      });
  }

}