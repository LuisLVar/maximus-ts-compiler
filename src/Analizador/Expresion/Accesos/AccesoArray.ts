import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Tipo } from "../../Utils/Tipo";
import { Error_ } from "../../Error/Error";
import { Retorno } from "../../Utils/Retorno";

export class AccesoArray extends Expresion {

  constructor(private id: any, private indice: Expresion, private anterior: Expresion, line: number, column: number) {
    super(line, column);
  }

  public traducir(entorno: Entorno): Retorno {
    let retorno: Retorno;

    return retorno;


  }

}