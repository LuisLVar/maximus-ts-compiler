import { Instruccion } from "../../Abstractos/Instruccion";
import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";

export class Print extends Instruccion { 

  constructor(private values: Array<Expresion>, linea: number, columna: number) { 
    super(linea, columna)
  }

  public traducir(entorno: Entorno) {


  }

}