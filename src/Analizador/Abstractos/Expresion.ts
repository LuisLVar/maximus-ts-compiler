import { Retorno, Tipo, tipoDominante } from "./Tipo";
import { Entorno } from "../Simbolo/Entorno";

export abstract class Expresion {
  
  private linea: number;
  private columna: number;

  constructor(linea: number, columna: number) {
    this.linea = linea;
    this.columna = columna;
  }

  public abstract traducir(entorno: Entorno): Retorno;


  public getDominante(tipo1: Tipo, tipo2: Tipo): Tipo { 

    let tipo = tipoDominante[tipo1][tipo2];
    if (tipo == undefined) { 
      tipo = Tipo.STRING;
    }
    return tipo;
  }

  getLinea() :number { 
    return this.linea;
  }
  
  getColumna():number { 
    return this.columna;
  }
}