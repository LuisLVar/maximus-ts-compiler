import { Tipo, tipoDominante } from "../Utils/Tipo";
import { Entorno } from "../Simbolo/Entorno";
import { Retorno } from "..//Utils/Retorno";

export abstract class Expresion {
  
  private linea: number;
  private columna: number;
  trueLabel : string;
  falseLabel : string;

  constructor(linea: number, columna: number) {
    this.linea = linea;
    this.columna = columna;
    this.trueLabel = this.falseLabel = '';
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