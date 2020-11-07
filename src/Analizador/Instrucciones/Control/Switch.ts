import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";
import { errores } from "../../Error/Errores";
import { Expresion } from "../../Abstractos/Expresion";
import { Case, tipoCase } from "../Control/Case";
import { Tipo } from "../../Utils/Tipo";
import { Generador } from "../../Generador/Generador";

export class Switch extends Instruccion {

  constructor(private condicion: Expresion, private cases: Array<Case>, linea: number, columna: number) {
    super(linea, columna);
  }

  getCases() {
    return this.cases;
  }

  public traducir(entorno: Entorno) {
    const expresion = this.condicion.traducir(entorno);
    const newEntorno = new Entorno(entorno);
    let casesLocales = new Array();
    let defaults = new Array();

    for (let i = 0; i < this.cases.length; i++) {
      let tipoC = this.cases[i].getTipoCase();
      if (tipoC == tipoCase.CASE) {
        casesLocales.push(this.cases[i]);
      } else {
        if (defaults.length == 0) {
          casesLocales.push(this.cases[i]);
          defaults.push(this.cases[i]);
        } else {
          throw new Error_(this.getLinea(), this.getColumna(), "Semántico",
            "No puede existir mas de una clausula default en un Switch.");
        }
      }
    }

    const generador = Generador.getInstance();
    let label1;
    let label2;
    let labelBreak = generador.newLabel();
    let defaultLabel;
    for (let i = 0; i < casesLocales.length; i++) { 
      if (casesLocales[i].getTipoCase() == tipoCase.CASE) {
        let caso = casesLocales[i].evaluarCase(entorno);
        label1 = generador.newLabel();
        label2 = generador.newLabel();
        generador.addIf(expresion.getValor(), caso.getValor(), '==', label1);
        generador.addGoto(label2);
        generador.addLabel(label2);
        casesLocales[i].labelTrue = label1;
        casesLocales[i].labelFalse = label2;
      } else { 
        defaultLabel = generador.newLabel();
        casesLocales[i].labelTrue = defaultLabel;
      }
    }
    //Goto a default
    generador.addGoto(defaultLabel);

    for (let i = 0; i < casesLocales.length; i++) { 
      newEntorno.break = labelBreak;
      newEntorno.continue = entorno.continue;
      newEntorno.size = entorno.size;
      newEntorno.esFuncion = entorno.esFuncion;
      newEntorno.retorno = entorno.retorno;
      generador.addLabel(casesLocales[i].labelTrue);
      casesLocales[i].traducir(newEntorno);
    }

    //Break
    generador.addLabel(labelBreak);



  }
}
