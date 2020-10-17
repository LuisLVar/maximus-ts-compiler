import { Expresion } from "../../Abstractos/Expresion";
import { Retorno, Tipo } from "../../Abstractos/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";


export enum tipoLogica {
  AND,
  OR
}

export class Logica extends Expresion {

  constructor(private left: Expresion, private right: Expresion, private tipo: tipoLogica, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno): Retorno {
    const leftValue = this.left.traducir(entorno);
    const rightValue = this.right.traducir(entorno);
    let result: Retorno;
    if (this.tipo == tipoLogica.AND) {

    }
    else if (this.tipo == tipoLogica.OR) {

    }
    console.log("Entro en el que no deberia");
    return { value: false, tipo: Tipo.BOOLEAN }
  }
}