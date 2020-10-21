import { Expresion } from "../../Abstractos/Expresion";
import { Tipo, Type } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";
import { Generador } from 'src/Analizador/Generador/Generador';


export enum tipoAritmetica {
  MAS,
  MENOS,
  POR,
  DIV,
  MOD,
  POT
}

export class Aritmetica extends Expresion {

  constructor(private left: Expresion, private right: Expresion, private tipo: tipoAritmetica, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno): Retorno {
    const leftValue = this.left.traducir(entorno);
    const rightValue = this.right.traducir(entorno);
    let result: Retorno;
    const generador = Generador.getInstance();
    const tmp = generador.newTmp();

    const tipoDominante = this.getDominante(leftValue.getTipo(), rightValue.getTipo());

    if (this.tipo == tipoAritmetica.MAS) {
      if (tipoDominante == Tipo.NUMBER) { 
        this.resolverNullBoolean(leftValue, rightValue);
        generador.addExpresion(tmp, leftValue.getValor(), '+', rightValue.getValor());
        result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
      }
    }
    else if (this.tipo == tipoAritmetica.MENOS) {
      if (tipoDominante == Tipo.NUMBER) {
        this.resolverNullBoolean(leftValue, rightValue);
        generador.addExpresion(tmp, leftValue.getValor(), '-', rightValue.getValor());
        result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede restar: ' + entorno.getTipoDato(leftValue.getTipo()) + ' y ' + entorno.getTipoDato(rightValue.getTipo()));
      }
    }
    else if (this.tipo == tipoAritmetica.POR) {
      if (tipoDominante == Tipo.NUMBER) {
        this.resolverNullBoolean(leftValue, rightValue);
        generador.addExpresion(tmp, leftValue.getValor(), '*', rightValue.getValor());
        result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede multiplicar: ' + entorno.getTipoDato(leftValue.getTipo()) + ' y ' + entorno.getTipoDato(rightValue.getTipo()));
      }
    }
    else if (this.tipo == tipoAritmetica.DIV) {
      if (tipoDominante == Tipo.NUMBER) {
        this.resolverNullBoolean(leftValue, rightValue);
        generador.addExpresion(tmp, leftValue.getValor(), '/', rightValue.getValor());
        result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede dividir: ' + entorno.getTipoDato(leftValue.getTipo()) + ' y ' + entorno.getTipoDato(rightValue.getTipo()));
      }
    }
    else if (this.tipo == tipoAritmetica.MOD) {
      if (tipoDominante == Tipo.NUMBER) {
        this.resolverNullBoolean(leftValue, rightValue);
        generador.addExpresion(tmp, leftValue.getValor(), '%', rightValue.getValor());
        result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede obtener resto de: ' + entorno.getTipoDato(leftValue.getTipo()) + ' y ' + entorno.getTipoDato(rightValue.getTipo()));
      }
    }
    else if (this.tipo == tipoAritmetica.POT) {

    }
    return result;
  }

  esNull(leftValue : Retorno, rightValue : Retorno) { 
    if (leftValue.getTipo() == Tipo.NULL) { 
      leftValue.valor = 0;
    }
    if (rightValue.getTipo() == Tipo.NULL) { 
      rightValue.valor = 0;
    }
    return { leftValue, rightValue }
  }

  esBoolean(leftValue : Retorno, rightValue : Retorno) { 
    if (leftValue.getTipo() == Tipo.BOOLEAN) { 
      if (leftValue.valor == "true") {
        leftValue.valor = 1;
      } else { 
        leftValue.valor = 0;
      }
    }
    if (rightValue.getTipo() == Tipo.BOOLEAN) { 
      if (rightValue.valor == "true") {
        rightValue.valor = 1;
      } else { 
        rightValue.valor = 0;
      }
    }
    return { leftValue, rightValue }
  }

  asignarValores(leftValue: Retorno, rightValue: Retorno, left: Retorno, right: Retorno) { 
    leftValue.valor = left.valor;
    leftValue.tipo = left.tipo;
    rightValue.valor = right.valor;
    rightValue.tipo = right.tipo;
  }

  resolverNullBoolean(leftValue: Retorno, rightValue: Retorno) { 
    let valores = this.esNull(leftValue, rightValue);
    this.asignarValores(leftValue, rightValue, valores.leftValue, valores.rightValue);
    valores = this.esBoolean(leftValue, rightValue);
    this.asignarValores(leftValue, rightValue, valores.leftValue, valores.rightValue);
  }

}