import { Component, OnInit } from '@angular/core';
import { consolaGlobal, RaizAST } from '../salidas/salidas';
import { errores } from '../../../Analizador/Error/Errores';
import { Error_ } from 'src/Analizador/Error/Error';
import { Instruccion } from 'src/Analizador/Abstractos/Instruccion';
import { Entorno } from 'src/Analizador/Simbolo/Entorno';
import { Tipo } from 'src/Analizador/Utils/Tipo';

import { Generador } from 'src/Analizador/Generador/Generador';

// Ejecucion
import Parser from '../../../Analizador/Gramatica/gramatica';
// Generador AST
import { Traductor } from '../../../Analizador/AST/AST';


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
    if (errores.length > 0) { 
      alert("Compilacion con errores!");
    }
    consolaGlobal.salida = "";
    this.console.salida = "";
    Generador.getInstance().limpiarGenerador();
    try {
      const global = new Entorno(null);
      const generador = Generador.getInstance();

      //Escribir encabezado
      generador.setEncabezado();


      //Escribir Funciones Nativas
      generador.nativaPrintString();
      generador.nativaPotencia();

      //Add Main
      generador.addMain();

      //Pasada, trauccion C3D    -- Escribir Main
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
      if (errores.length > 0) { 
        alert("Compilacion con errores!");
      }

      //Incluir temporales
      generador.declararTemporales();

      
      //Concluir Main
      generador.addMainEnd();

      const inicio = generador.code.slice(0, 7);
      const fin = generador.code.slice(7, generador.code.length);
      const codigo = inicio.concat(generador.codeFunciones, fin);
      generador.code = codigo;

      let code = generador.getCode();
      consolaGlobal.salida = code;


    } catch (error) {
      console.log(error);
      errores.push(error);
    }
    this.generarASTEjecucion();
  }


  //Limpieza
  limpiarEntrada() {
    this.console.entrada = "";
  }

  limpiarTraduccion() {
    this.console.salida = "";
  }

  generarASTEjecucion() { 
    let ast = Traductor(consolaGlobal.entrada);
    RaizAST.raiz = ast;

  }
  

}
