import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CompartirComidasService {

  private platformId = inject(PLATFORM_ID);

  // COMIDAS SELECCIONADAS

  public comidasSignal = signal<any[]>(this.obtenerComidasIniciales());

  private obtenerComidasIniciales() {

    if (isPlatformBrowser(this.platformId)) {

      const comidasGuardadas = localStorage.getItem('comidasActuales');

      return comidasGuardadas ? JSON.parse(comidasGuardadas) : [];

    }

    return [];

  }

  // AGREGAR COMIDA

  agregarComida(comida: any) {

    let comidas = [...this.comidasSignal()];

    let existe = comidas.find(c => c.idMeal == comida.idMeal);

    if (existe) {

      existe.cantidad += comida.cantidad;

    } else {

      comidas.push({...comida});

    }

    this.actualizarComidas(comidas);

  }

  // ACTUALIZAR COMIDAS

  actualizarComidas(comidas: any[]) {

    this.comidasSignal.set(comidas);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('comidasActuales', JSON.stringify(comidas));
    }

  }

  // LIMPIAR COMIDAS

  limpiar() {

    this.comidasSignal.set([]);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('comidasActuales');
    }

  }


  // DATOS DEL CLIENTE

  public pedidoSignal = signal<any>(this.obtenerPedidoInicial());

  private obtenerPedidoInicial() {

    if (isPlatformBrowser(this.platformId)) {

      const pedidoGuardado = localStorage.getItem('pedidoCliente');

      return pedidoGuardado ? JSON.parse(pedidoGuardado) : null;

    }

    return null;

  }

  // GUARDAR DATOS DEL CLIENTE

  enviarPedido(datosPedido: any) {

    console.log('Guardando datos del cliente:', datosPedido);

    this.pedidoSignal.set(datosPedido);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('pedidoCliente', JSON.stringify(datosPedido));
    }

  }

  // LIMPIAR DATOS DEL CLIENTE

  limpiarPedido() {

    this.pedidoSignal.set(null);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('pedidoCliente');
    }

  }

}