import { Component, OnInit } from '@angular/core';
import { salida } from '../salidas/salidas';

@Component({
  selector: 'app-consola',
  templateUrl: './consola.component.html',
  styleUrls: ['./consola.component.css']
})
export class ConsolaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.salida = salida;
  }

  salida: any;

  entrada: any = salida.entrada;
  
  generarASTEjecucion() { 
  }
  
  ejecutarCodigo() {
  }

  traducirCodigo() {

  }

  limpiarEntrada() {
    salida.entrada = "";
  }

  limpiarTraduccion() {
    salida.traduccion = "";
  }

  limpiarConsola() {
    salida.consola = "";
  }


}
