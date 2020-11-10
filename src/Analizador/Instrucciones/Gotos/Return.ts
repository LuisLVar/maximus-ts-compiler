import { Error_ } from "../../Error/Error";
import { Entorno } from "../../Simbolo/Entorno";
import { Instruccion } from "../../Abstractos/Instruccion";
import { Generador } from "../../Generador/Generador";
import { Expresion } from "../../Abstractos/Expresion";
import { Tipo } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";

export class Return extends Instruccion {

  constructor(private expresion: Expresion, linea: number, columna: number) {
    super(linea, columna);
  }

  traducir(entorno: Entorno) {
    const generador = Generador.getInstance();
    let resultado = this.expresion.traducir(entorno);
    generador.setToStack('p', resultado.getValor());
    generador.addGoto(entorno.retorno);

  }
}