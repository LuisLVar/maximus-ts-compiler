import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";
import { Expresion } from "../../Abstractos/Expresion";
import { Tipo, Type } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";
import { Error_ } from "../../Error/Error";
import { Generador } from '../../Generador/Generador';
import { tipoDeclaracion } from "./Declaracion";


export class Asignacion extends Instruccion {

  private id: string;
  private valor: Expresion;

  constructor(id: string, valor: Expresion, linea: number, columna: number) {
    super(linea, columna);
    this.id = id;
    this.valor = valor;
  }

  public traducir(entorno: Entorno) {
    let variable = entorno.getVariable(this.id);
    let generador = Generador.getInstance();
    let tmp = generador.newTmp();
    generador.addExpresion(tmp, 'p', '+', variable.getPosRelativa());
    let expresion = this.valor.traducir(entorno);
    let tipoType = variable.getTipo();
    let tipo = tipoType.tipo;

    if (variable == undefined) { 
      throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "Error en asignacion, variable no declarada: " + this.id);
    }

    if (variable?.getTipoVariable() == tipoDeclaracion.CONST) { 
      throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "Error en asignacion, no se puede asignar un valor nuevo a una constante: " + this.id);
    }

    if (tipo != expresion.getTipo()) { 
      throw new Error_(this.getLinea(), this.getColumna(),
        'Semántico', "Error en asignacion: " + entorno.getTipoDato(expresion.getTipo()) + " no es asignable a " + entorno.getTipoDato(variable.getTipo().getTipo()));
    }

    if (tipo == Tipo.BOOLEAN || tipo == Tipo.NUMBER) {
      while (entorno != null) {
        if (entorno.variables.has(this.id)) {
          let generador = Generador.getInstance();
          generador.asignarVariable(tmp, expresion);
          return;
        }
        entorno = entorno.anterior;
      }
      throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "Error en asignacion: variable " + this.id + " no ha sido declarada.");
    } else {

    }

  }
}