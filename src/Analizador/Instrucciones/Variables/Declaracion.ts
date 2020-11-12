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
    if (this.valor != null) {
      let expresion = this.valor.traducir(entorno);
      if (expresion.getTipo() == this.tipo.tipo || expresion.getTipo() == Tipo.VOID) {
        if (this.tipo.dim > 0) {
          //Es Array
          let tipoFinal = new Type(Tipo.ARRAY, this.tipo.tipo, this.tipo.dim);
          // entorno.declararVariable(this.id, expresion, tipoFinal, this.tipoVariable, this.getLinea(), this.getColumna());
        } else {
          let tipoFinal = new Type(this.tipo.tipo, null, 0);
          let heap: boolean = false;
          if (tipoFinal.tipo == Tipo.STRING) { 
            heap = true
          } 
          entorno.variables.set(this.id, new Simbolo(this.id, tipoFinal, this.tipoVariable, entorno.size - 1, heap, this.getLinea(), this.getColumna()));
          generador.declararVariable(tmp, expresion);
        }
  
      } else {
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "Error en declaracion: " +
          entorno.getTipoDato(expresion.getTipo()) + " no es asignable a " + entorno.getTipoDato(this.tipo.tipo));
      }
    } else { 
      let tipoFinal : Type;
      let expresion : Retorno;
      switch (this.tipo.tipo) { 
        case Tipo.NUMBER:
          tipoFinal = new Type(this.tipo.tipo, null, 0);
          expresion = new Retorno('0', false, tipoFinal);
          entorno.variables.set(this.id, new Simbolo(this.id, tipoFinal, this.tipoVariable, entorno.size - 1, false, this.getLinea(), this.getColumna()));
          generador.declararVariable(tmp, expresion);
          break;
        case Tipo.BOOLEAN:
          tipoFinal = new Type(this.tipo.tipo, null, 0);
          expresion = new Retorno('', false, tipoFinal);
          expresion.trueLabel = generador.newLabel();
          expresion.falseLabel = generador.newLabel();
          generador.addGoto(expresion.falseLabel);
          expresion.retornoLbl = generador.newLabel();
          generador.addLabel(expresion.retornoLbl);
          entorno.variables.set(this.id, new Simbolo(this.id, tipoFinal, this.tipoVariable, entorno.size - 1, false, this.getLinea(), this.getColumna()));
          generador.declararVariable(tmp, expresion);
          break;
        case Tipo.STRING:
          tipoFinal = new Type(this.tipo.tipo, null, 0);
          expresion = new Retorno('-1', false, tipoFinal);
          entorno.variables.set(this.id, new Simbolo(this.id, tipoFinal, this.tipoVariable, entorno.size - 1, true, this.getLinea(), this.getColumna()));
          generador.declararVariable(tmp, expresion);
          break;
        case Tipo.TYPE:
          break;
        case Tipo.ARRAY:
          break;
      }
    }

  }
}