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

        if (leftValue.getTipo() == Tipo.BOOLEAN) {
          generador.addLabel(leftValue.trueLabel);
          generador.addExpresion(tmp, '1', '+', rightValue.getValor());
          let label = generador.newLabel();
          generador.addGoto(label);
          generador.addLabel(leftValue.falseLabel);
          generador.addExpresion(tmp, '0', '+', rightValue.getValor());
          generador.addLabel(label);
          result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
        }
        else if (rightValue.getTipo() == Tipo.BOOLEAN) {
          generador.addLabel(rightValue.trueLabel);
          generador.addExpresion(tmp, leftValue.getValor(), '+', '1');
          let label = generador.newLabel();
          generador.addGoto(label);
          generador.addLabel(rightValue.falseLabel);
          generador.addExpresion(tmp, leftValue.getValor(), '+', '0');
          generador.addLabel(label);
          result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
          
        } else { 
          this.resolverNullBoolean(leftValue, rightValue);
          generador.addExpresion(tmp, leftValue.getValor(), '+', rightValue.getValor());
          result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
        }

      } else if (tipoDominante == Tipo.STRING) {
        this.resolverNullBoolean(leftValue, rightValue);

        generador.addComment("------------  Inicio Concatenacion -------------");

        //Acomodamos el c3d para procesar booleanos como strings.
        let tmpBooleanGlobal = '';
        if (leftValue.trueLabel != '') {
          let salidaLbl = generador.newLabel();
          let tmpBoolean = generador.newTmp();
          let lblRetorno = leftValue.retornoLbl;
          let tmpRetorno = generador.newTmp();


          generador.addGoto(salidaLbl);

          generador.addLabel(leftValue.trueLabel);
          generador.addExpresion(tmpBoolean, 1);
          generador.addExpresion(tmpRetorno, 1);
          generador.addGoto(lblRetorno);
          generador.addLabel(leftValue.falseLabel);
          generador.addExpresion(tmpBoolean, 0);
          generador.addExpresion(tmpRetorno, 1);
          generador.addGoto(lblRetorno)
          generador.addLabel(salidaLbl);
          tmpBooleanGlobal = tmpBoolean;
        }
        
        if (rightValue.trueLabel != '') { 
          let salidaLbl = generador.newLabel();
          let tmpBoolean = generador.newTmp();
          generador.addLabel(rightValue.trueLabel);
          generador.addExpresion(tmpBoolean, 1);
          generador.addGoto(salidaLbl);
          generador.addLabel(rightValue.falseLabel);
          generador.addExpresion(tmpBoolean, 0);
          generador.addLabel(salidaLbl);
          tmpBooleanGlobal = tmpBoolean;
        }


        let tmp = generador.newTmp();
        generador.addExpresion(tmp, 'h');
        if (leftValue.getTipo() == Tipo.STRING) {
          
          let label = generador.newLabel();
          let tmpH = generador.newTmp();
          let tmpRes = generador.newTmp();
          generador.addExpresion(tmpH, leftValue.getValor());
          generador.addLabel(label);

          let labelTrue = generador.newLabel();
          let labelFalse = generador.newLabel();
          generador.getFromHeap(tmpRes, tmpH);
          generador.addIf(tmpRes, '-1', '!=', labelTrue);
          generador.addGoto(labelFalse);
          generador.addLabel(labelTrue);
          generador.setToHeap('h', tmpRes);
          generador.addExpresion(tmpH, tmpH, '+', 1);
          generador.nextHeap();
          generador.addGoto(label);
          generador.addLabel(labelFalse);

        } else if(leftValue.getTipo() == Tipo.NUMBER){  //TODO Enteros y decimales
          let tmpRes2 = generador.newTmp();
          generador.addExpresion(tmpRes2, leftValue.getValor());
          generador.setToHeap('h', tmpRes2);
          generador.nextHeap();
        } else if (leftValue.getTipo() == Tipo.BOOLEAN) { 
          let trueLbl = generador.newLabel();
          let falseLabel = generador.newLabel();
          let salidaLbl = generador.newLabel();
          
          generador.addIf(tmpBooleanGlobal, 1, '==', trueLbl);
          generador.addGoto(falseLabel);
          generador.addLabel(trueLbl);
          generador.addTrueHeap();
          generador.addGoto(salidaLbl);
          generador.addLabel(falseLabel);
          generador.addFalseHeap();
          generador.addLabel(salidaLbl);
        }

        if (rightValue.getTipo() == Tipo.STRING) {
          
          let label = generador.newLabel();
          let tmpH = generador.newTmp();
          let tmpRes = generador.newTmp();
          generador.addExpresion(tmpH, rightValue.getValor());
          generador.addLabel(label);

          let labelTrue = generador.newLabel();
          let labelFalse = generador.newLabel();
          generador.getFromHeap(tmpRes, tmpH);
          generador.addIf(tmpRes, '-1', '!=', labelTrue);
          generador.addGoto(labelFalse);
          generador.addLabel(labelTrue);
          generador.setToHeap('h', tmpRes);
          generador.addExpresion(tmpH, tmpH, '+', 1);
          generador.nextHeap();
          generador.addGoto(label);
          generador.addLabel(labelFalse);

        } else if (rightValue.getTipo() == Tipo.NUMBER) {
          let tmpRes2 = generador.newTmp();
          generador.addExpresion(tmpRes2, rightValue.getValor());
          generador.setToHeap('h', tmpRes2);
          generador.nextHeap();
        } else if (rightValue.getTipo() == Tipo.BOOLEAN) { 

          let trueLbl = generador.newLabel();
          let falseLabel = generador.newLabel();
          let salidaLbl = generador.newLabel();
          
          generador.addIf(tmpBooleanGlobal, 1, '==', trueLbl);
          generador.addGoto(falseLabel);
          generador.addLabel(trueLbl);
          generador.addTrueHeap();
          generador.addGoto(salidaLbl);
          generador.addLabel(falseLabel);
          generador.addFalseHeap();
          generador.addLabel(salidaLbl);

        }
        generador.setToHeap('h', '-1');
        generador.nextHeap();


        generador.addComment("------------  Fin Concatenacion ------------");
        result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede sumar: ' + entorno.getTipoDato(leftValue.getTipo()) + ' y ' + entorno.getTipoDato(rightValue.getTipo()));
      
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
        generador.addModulo(tmp, leftValue.getValor(), rightValue.getValor());
        result = new Retorno(tmp, true, new Type(tipoDominante, null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede obtener resto de: ' + entorno.getTipoDato(leftValue.getTipo()) + ' y ' + entorno.getTipoDato(rightValue.getTipo()));
      }
    }
    else if (this.tipo == tipoAritmetica.POT) {
      if (leftValue.getTipo() == Tipo.NUMBER && rightValue.getTipo() == Tipo.NUMBER) {
        generador.addComment("--------- Inicio Potencia --------------");
        let tmp = generador.newTmp();
        generador.addExpresion(tmp, 'p', '+', '3');  // cambio simulado de ambito
  
        let tmpParam1 = generador.newTmp();
        generador.addExpresion(tmpParam1, tmp, '+', '1');
        generador.setToStack(tmpParam1, leftValue.getValor());
  
        let tmpParam2 = generador.newTmp();
        generador.addExpresion(tmpParam2, tmp, '+', '2');
        generador.setToStack(tmpParam2, rightValue.getValor());
  
        generador.addExpresion('p', 'p', '+', '3');  // Cambio de Ambito
  
        generador.code.push("_nativaPotencia();");
  
        let tmpRI = generador.newTmp();
        generador.addExpresion(tmpRI, 'p');
  
        let tmpR = generador.newTmp();
        generador.getFromStack(tmpR, tmpRI);
  
        generador.addExpresion('p', 'p', '-', '3');  // Cambio de Ambito
        generador.addComment("--------- Fin Potencia --------------");
        result = new Retorno(tmpR, true, new Type(Tipo.NUMBER, null, 0));

      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede obtener potencia de: ' + entorno.getTipoDato(leftValue.getTipo()) + ' y ' + entorno.getTipoDato(rightValue.getTipo()));
      }
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