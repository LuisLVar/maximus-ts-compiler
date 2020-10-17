import { Expresion } from "../../Abstractos/Expresion";
import { Retorno, Tipo } from "../../Abstractos/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";


export enum tipoAritmetica {
  MAS,
  MENOS,
  POR,
  DIV,
  MOD,
  POT
}

export class Aritmetica extends Expresion {

  constructor(private left: Expresion, private right: Expresion, private tipo: tipoAritmetica, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno): Retorno {
    const leftValue = this.left.traducir(entorno);
    const rightValue = this.right.traducir(entorno);
    let result: Retorno;

    const tipoDominante = this.getDominante(leftValue.tipo, rightValue.tipo);

    if (this.tipo == tipoAritmetica.MAS) {

    }
    else if (this.tipo == tipoAritmetica.MENOS) {

    }
    else if (this.tipo == tipoAritmetica.POR) {

    }
    else if (this.tipo == tipoAritmetica.DIV) {

    }
    else if (this.tipo == tipoAritmetica.MOD) {

    }
    else if (this.tipo == tipoAritmetica.POT) {

    }
    else { 
      result = { value: ("Error: "+ leftValue.value.toString() + rightValue.value.toString()), tipo: Tipo.STRING };
    }
    return result;
  }

}