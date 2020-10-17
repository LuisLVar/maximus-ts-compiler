import { Expresion } from "../../Abstractos/Expresion";
import { Retorno, Tipo } from "../../Abstractos/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";

export class Ternario extends Expresion {

  constructor(private condicion: Expresion, private exp1: Expresion, private exp2: Expresion, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno) : Retorno {
    let retorno: Retorno;
    return retorno;

  }
}