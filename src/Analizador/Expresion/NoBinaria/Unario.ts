import { Expresion } from "../../Abstractos/Expresion";
import { Tipo } from "../../Utils/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";
import { Retorno } from "../../Utils/Retorno";


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
    const tipoDominante = this.getDominante(valor.getTipo(), valor.getTipo());
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
      
    }
    return result;
  }
}