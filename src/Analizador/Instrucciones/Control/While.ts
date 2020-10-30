import { Instruccion } from "../../Abstractos/Instruccion";
import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Tipo } from "../../Utils/Tipo";
import { Error_ } from "../../Error/Error";
import { Generador } from "../../Generador/Generador";

export class While extends Instruccion {

  constructor(private condicion: Expresion, private cuerpo: Instruccion, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno) {
    const generador = Generador.getInstance();
    const newEntorno = new Entorno(entorno);
    const labelWhile = generador.newLabel();
    generador.addComment(' --------- Estructura de Control: While ----------');
    generador.addLabel(labelWhile);
    let condicion = this.condicion.traducir(entorno);
    if (condicion.getTipo() != Tipo.BOOLEAN) {
      throw new Error_(this.getLinea(), this.getColumna(), "Semántico",
        "Error While: Tipo incorrecto de condicion -> " + entorno.getTipoDato(condicion.getTipo()) + ", se esperaba Boolean.");
    } else { 
      newEntorno.break = condicion.falseLabel;
      newEntorno.continue = labelWhile;
      newEntorno.size = entorno.size;
      generador.addLabel(condicion.trueLabel);
      this.cuerpo.traducir(newEntorno);
      generador.addGoto(labelWhile);
      generador.addLabel(condicion.falseLabel);
      generador.addComment('------------ Fin While -------------------');
      return;
    }
  }
}