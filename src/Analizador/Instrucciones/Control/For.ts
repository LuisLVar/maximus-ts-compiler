import { Instruccion } from "../../Abstractos/Instruccion";
import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Tipo } from "../../Utils/Tipo";
import { Error_ } from "../../Error/Error";
import { Asignacion } from "./../Variables/Asignacion";
import { Generador } from "../../Generador/Generador";

export class For extends Instruccion {

  constructor(private declaracion: Instruccion, private condicion: Expresion, private asignacion: Instruccion,
    private cuerpo: Instruccion, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno) {
    console.log("Entro For");
    const generador = Generador.getInstance();
    const newEntorno = new Entorno(entorno);
    const labelFor = generador.newLabel();
    generador.addComment(' --------- Estructura de Control: For ----------');
    this.declaracion.traducir(newEntorno);
    generador.addLabel(labelFor);
    let condicion = this.condicion.traducir(newEntorno);
    if (condicion.getTipo() != Tipo.BOOLEAN) {
      throw new Error_(this.getLinea(), this.getColumna(), "Semántico",
        "Error While: Tipo incorrecto de condicion -> " + entorno.getTipoDato(condicion.getTipo()) + ", se esperaba Boolean.");
    } else { 
      newEntorno.break = condicion.falseLabel;
      newEntorno.continue = labelFor;
      newEntorno.size = entorno.size;
      newEntorno.esFuncion = entorno.esFuncion;
      generador.addLabel(condicion.trueLabel);
      this.cuerpo.traducir(newEntorno);
      this.asignacion.traducir(newEntorno);
      generador.addGoto(labelFor);
      generador.addLabel(condicion.falseLabel);
      generador.addComment('------------ Fin For -------------------');
      return;
    }
  }
}                                                    