import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BebidasService {

  constructor() { }

  // 1. BUSCAR BEBIDAS POR INGREDIENTE
  private urlBebidaIngrediente = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=";

  mostrarPorIngrediente(ingrediente: string) {
    return fetch(this.urlBebidaIngrediente + encodeURIComponent(ingrediente))
      .then(response => response.json())
      .then(data => {
        return data.drinks ?? [];
      })
      .catch(error => {
        console.error('Error al obtener las bebidas:', error);
        throw error;
      });
  }


  // 2. OBTENER DETALLES DE UNA BEBIDA POR ID
  private urlDetalle = "https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=";

  mostrarDetalle(id: string) {
    return fetch(this.urlDetalle + encodeURIComponent(id))
      .then(response => response.json())
      .then(data => {
        return data.drinks ?? [];
      })
      .catch(error => {
        console.error('Error al obtener los detalles:', error);
        throw error;
      });
  }


  // 3. BUSCAR BEBIDAS POR TIPO DE ALCOHOL
  private urlBebidaAlcohol = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=";

  mostrarPorAlcohol(tipo: string) {
    return fetch(this.urlBebidaAlcohol + encodeURIComponent(tipo))
      .then(response => response.json())
      .then(data => {
        return data.drinks ?? [];
      })
      .catch(error => {
        console.error('Error al obtener las bebidas:', error);
        throw error;
      });
  }


  // 4. BUSCAR BEBIDAS POR NOMBRE
  private urlDetalleB = "https://www.thecocktaildb.com/api/json/v1/1/search.php?s=";

  mostrarPorNombre(nombre: string) {
    return fetch(this.urlDetalleB + encodeURIComponent(nombre))
      .then(response => response.json())
      .then(data => {
        return data.drinks ?? [];
      })
      .catch(error => {
        console.error('Error al buscar bebidas por nombre:', error);
        throw error;
      });
  }


  // 5. OBTENER LA LISTA DE CATEGORÍAS
  private urlBebidaCategoria = "https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list";

  mostrarCategorias() {
    return fetch(this.urlBebidaCategoria)
      .then(response => response.json())
      .then(data => {
        return data.drinks ?? [];
      })
      .catch(error => {
        console.error('Error al obtener las categorías:', error);
        throw error;
      });
  }


  // 6. BUSCAR BEBIDAS POR CATEGORÍA
  private urlMostrarPorCategoria = "https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=";

  mostrarPorCategoria(categoria: string) {
    return fetch(this.urlMostrarPorCategoria + encodeURIComponent(categoria))
      .then(response => response.json())
      .then(data => {
        return data.drinks ?? [];
      })
      .catch(error => {
        console.error('Error al obtener las bebidas por categoría:', error);
        throw error;
      });
  }

}