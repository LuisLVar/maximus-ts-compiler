import { Entorno } from "../Simbolo/Entorno";

export abstract class Instruccion { 

  private linea: number;
  private columna: number;

  constructor(linea: number, columna: number) { 
    this.linea = linea;
    this.columna = columna;
  }

  public abstract traducir(entorno: Entorno): any;

  getLinea():number { 
    return this.linea;
  }
  
  getColumna():number { 
    return this.columna;
  }


}