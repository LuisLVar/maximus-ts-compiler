import { Instruccion } from "../../Abstractos/Instruccion";
import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Tipo } from "../../Utils/Tipo";
import { Error_ } from "../../Error/Error";
import { Generador } from "../../Generador/Generador";

export class DoWhile extends Instruccion {

  constructor(private condicion: Expresion, private cuerpo: Instruccion, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno) {
    console.log("Entro While");
    const generador = Generador.getInstance();
    const newEntorno = new Entorno(entorno);
    generador.addComment(' --------- Estructura de Control: DoWhile ----------');
    newEntorno.continue = this.condicion.trueLabel = generador.newLabel();
    newEntorno.break = this.condicion.falseLabel = generador.newLabel();
    newEntorno.size = entorno.size;
    newEntorno.esFuncion = entorno.esFuncion;
    generador.addLabel(this.condicion.trueLabel);
    this.cuerpo.traducir(newEntorno);
    const condicion = this.condicion.traducir(entorno);
    if (condicion.getTipo() == Tipo.BOOLEAN) {
      generador.addLabel(condicion.falseLabel);
      generador.addComment('------------ Fin DoWhile -------------------');
      return;
    }
    if (condicion.getTipo() != Tipo.BOOLEAN) {
      throw new Error_(this.getLinea(), this.getColumna(), "Semántico",
        "Error DoWhile: Tipo incorrecto de condicion -> " + entorno.getTipoDato(condicion.getTipo()) + ", se esperaba Boolean.");
    }
  }
}