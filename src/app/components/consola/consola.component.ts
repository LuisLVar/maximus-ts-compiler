import { Component, OnInit } from '@angular/core';
import { consolaGlobal } from '../salidas/salidas';
import { errores } from '../../../Analizador/Error/Errores';
import { Error_ } from 'src/Analizador/Error/Error';
import { Instruccion } from 'src/Analizador/Abstractos/Instruccion';
import { Entorno } from 'src/Analizador/Simbolo/Entorno';
import { Tipo } from 'src/Analizador/Utils/Tipo';

import { Generador } from 'src/Analizador/Generador/Generador';

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
    errores.length = 0;
    let ast = Parser.parse(consolaGlobal.entrada);
    consolaGlobal.salida = "";
    this.console.salida = "";
    Generador.getInstance().limpiarGenerador();
    console.log(ast);
    try {
      let global = new Entorno(null);

      //Pasada, trauccion C3D
      for (let instruccion of ast) {
        try {
          if (instruccion instanceof Instruccion) {
            instruccion.traducir(global);
          }
        } catch (error) {
          console.log(error);
          errores.push(error);
        }
      }

      let code = Generador.getInstance().getCode();
      consolaGlobal.salida = code;
      

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
    this.console.salida = "";
  }


}
