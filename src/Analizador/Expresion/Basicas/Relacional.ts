import { Expresion } from "../../Abstractos/Expresion";
import { Retorno, Tipo } from "../../Abstractos/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";


export enum tipoRelacional {
  MAYORQUE,
  MENORQUE,
  MAYORIGUAL,
  MENORIGUAL,
  IGUALIGUAL,
  DESIGUAL
}

export class Relacional extends Expresion {

  constructor(private left: Expresion, private right: Expresion, private tipo: tipoRelacional, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno): Retorno {
    const leftValue = this.left.traducir(entorno);
    const rightValue = this.right.traducir(entorno);
    if (this.tipo == tipoRelacional.IGUALIGUAL) {

    }
    else if (this.tipo == tipoRelacional.DESIGUAL) {

    }
    else if (this.tipo == tipoRelacional.MAYORQUE) {

    }
    else if (this.tipo == tipoRelacional.MENORQUE) {

    }
    else if (this.tipo == tipoRelacional.MAYORIGUAL) {

    }
    else if (this.tipo == tipoRelacional.MENORIGUAL) {

    }
    return { value: -1, tipo: Tipo.NUMBER }
  }
}