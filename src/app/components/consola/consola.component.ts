import { Component, OnInit } from '@angular/core';
import { consolaGlobal } from '../salidas/salidas';
import { errores } from '../../../Analizador/Error/Errores';
import { Error_ } from 'src/Analizador/Error/Error';
import { Instruccion } from 'src/Analizador/Abstractos/Instruccion';
import { Entorno } from 'src/Analizador/Simbolo/Entorno';
import { Tipo } from 'src/Analizador/Abstractos/Tipo';

// Ejecucion
import Parser from '../../../Analizador/Gramatica/gramatica';


@Component({
  selector: 'app-consola',
  templateUrl: './consola.component.html',
  styleUrls: ['./consola.component.css']
})
export class ConsolaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.console = consolaGlobal;
  }

  console: any;

  traducirCodigo() {
    this.console.salida = this.console.entrada;
    errores.length = 0;
    let ast = Parser.parse(consolaGlobal.entrada);
    consolaGlobal.salida = "";
    console.log(ast);
    try {
      let global = new Entorno(null);

      //Pasada, trauccion C3D
      for (let instruccion of ast) {
        try {
          if (instruccion instanceof Instruccion) {
            const retorno = instruccion.traducir(global);
            this.console = consolaGlobal;
            if (retorno != null || retorno != undefined) {
              if (retorno.tipo == Tipo.BREAK) {
                throw new Error_(instruccion.getLinea(), instruccion.getColumna(), "Semántico",
                  "BreakError: La clausula 'break' unicamente puede ser utilizada en ciclos o Switch");
              }
              else if (retorno.tipo == Tipo.CONTINUE) {
                throw new Error_(instruccion.getLinea(), instruccion.getColumna(), "Semántico",
                  "ContinueError: La clausula 'continue' unicamente puede ser utilizada en ciclos.");
              }
            }
          }
        } catch (error) {
          console.log(error);
          errores.push(error);
        }
      }
      let re = /\\n/gi;
      this.console.salida = this.console.salida.replace(re, "\n");
      re = /\\t/gi;
      this.console.salida = this.console.salida.replace(re, "\t");

    } catch (error) {
      console.log(error);
      errores.push(error);
    }
  }


  //Limpieza
  limpiarEntrada() {
    this.console.entrada = "";
  }

  limpiarTraduccion() {
    this.console.traduccion = "";
  }


}
