import { Expresion } from "../../Abstractos/Expresion";
import { Retorno, Tipo } from "../../Abstractos/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";


export enum tipoUnario {
  UMENOS,
  UMAS,
  INC,
  DEC,
  NOT
}

export class Unario extends Expresion {

  constructor(private unario: Expresion, private tipo: tipoUnario, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno): Retorno {
    const valor = this.unario.traducir(entorno);
    let result: Retorno;
    const tipoDominante = this.getDominante(valor.tipo, valor.tipo);
    if (this.tipo == tipoUnario.UMAS) {

    }
    else if (this.tipo == tipoUnario.UMENOS) {

    }
    else if (this.tipo == tipoUnario.INC) {

    }
    else if (this.tipo == tipoUnario.DEC) {

    }
    else if (this.tipo == tipoUnario.NOT) {

    }
    else { 
      result = { value: ("Error: "+ valor.value.toString()), tipo: Tipo.STRING };
    }
    return result;
  }
}