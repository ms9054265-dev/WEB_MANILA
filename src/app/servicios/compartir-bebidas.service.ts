import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CompartirBebidasService {

  private platformId = inject(PLATFORM_ID);

  // BEBIDAS SELECCIONADAS

  public bebidasSignal = signal<any[]>(this.obtenerBebidasIniciales());

  private obtenerBebidasIniciales() {

    if (isPlatformBrowser(this.platformId)) {

      const bebidasGuardadas = localStorage.getItem('bebidasActuales');

      return bebidasGuardadas ? JSON.parse(bebidasGuardadas) : [];

    }

    return [];

  }

  // AGREGAR BEBIDA

  agregarBebida(bebida: any) {

    let bebidas = [...this.bebidasSignal()];

    let existe = bebidas.find(b => b.idDrink == bebida.idDrink);

    if (existe) {

      existe.cantidad += bebida.cantidad;

    } else {

      bebidas.push({...bebida});

    }

    this.actualizarBebidas(bebidas);

  }

  // ACTUALIZAR BEBIDAS

  actualizarBebidas(bebidas: any[]) {

    this.bebidasSignal.set(bebidas);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('bebidasActuales', JSON.stringify(bebidas));
    }

  }

  // LIMPIAR BEBIDAS

  limpiar() {

    this.bebidasSignal.set([]);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('bebidasActuales');
    }

  }

}