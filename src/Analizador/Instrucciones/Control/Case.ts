import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";
import { errores } from "../../Error/Errores";
import { Expresion } from "../../Abstractos/Expresion";
import { Retorno } from "../../Utils/Retorno";

export enum tipoCase {
  CASE = 0,
  DEFAULT = 1
}

export class Case extends Instruccion {

  labelTrue = '';
  labelFalse = '';

  constructor(private condicion: Expresion, private cuerpo: Array<Instruccion>, linea: number,
    columna: number, private tipo: tipoCase) {
    super(linea, columna);
  }

  getCase() { 
    return this.cuerpo;
  }

  getTipoCase() { 
    return this.tipo;
  }

  public traducir(entorno: Entorno) {
    for (const instruccion of this.cuerpo) {
      try {
        const retorno = instruccion.traducir(entorno);
        if (retorno != null || retorno != undefined) { 
          return retorno;
        }
      } catch (error) {
        errores.push(error);
      }
    }
  }

  evaluarCase(entorno: Entorno) { 
    const condicion = this.condicion.traducir(entorno);
    return condicion;
  }
}
