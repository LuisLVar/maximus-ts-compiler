import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";
import { Expresion } from "../../Abstractos/Expresion";
import { Tipo, Type } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";
import { Error_ } from "../../Error/Error";
import { Generador } from 'src/Analizador/Generador/Generador';
import { Simbolo } from 'src/Analizador/Simbolo/Simbolo';


export enum tipoDeclaracion {
  LET = 1,
  CONST = 2
}


export class Declaracion extends Instruccion {

  private id: string;
  private valor: Expresion;
  private tipo: any;
  private tipoVariable: tipoDeclaracion;

  constructor(id: string, tipo: any, valor: Expresion, tipoVariable: tipoDeclaracion, linea: number, columna: number) {
    super(linea, columna);
    this.id = id;
    this.valor = valor;
    this.tipo = tipo;
    this.tipoVariable = tipoVariable;
  }

  public traducir(entorno: Entorno) {
    let variable = entorno.getVariableDeclaracion(this.id);
    if (variable != undefined) {
      throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "Error en declaracion, variable ya fue declarada: " + this.id);
    }

    let generador = Generador.getInstance();
    let tmp = generador.newTmp();
    generador.addExpresion(tmp, 'p', '+', entorno.size++);
    let expresion = this.valor.traducir(entorno);
    if (expresion.getTipo() == this.tipo.tipo) {
      if (this.tipo.dim > 0) {
        //Es Array
        let tipoFinal = new Type(Tipo.ARRAY, this.tipo.tipo, this.tipo.dim);
        // entorno.declararVariable(this.id, expresion, tipoFinal, this.tipoVariable, this.getLinea(), this.getColumna());
      } else { 
        let tipoFinal = new Type(this.tipo.tipo, null, 0);
        entorno.variables.set(this.id, new Simbolo(this.id, tipoFinal, this.tipoVariable, entorno.size-1, false, this.getLinea(), this.getColumna()));
        generador.declararVariable(tmp, expresion);
      }

    } else { 
      throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "Error en declaracion: " +
      entorno.getTipoDato(expresion.getTipo()) + " no es asignable a " + entorno.getTipoDato(this.tipo.tipo));
    }
  }
}