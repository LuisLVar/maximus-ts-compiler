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

        let tmpNumberRight = generador.newTmp();
        // Manejo de numeros del lado Derecho
        if (rightValue.getTipo() == Tipo.NUMBER) {
          generador.addComment("------ Concatenacion de number reversa ---------");

          let t0 = generador.newTmp();
          generador.addExpresion(t0, "(int)" + rightValue.getValor());

          //---------------------------------------------
          let LN = generador.newLabel();
          let LP = generador.newLabel();
          let LN2 = generador.newLabel();
          let LP2 = generador.newLabel();
          let LNX = generador.newLabel();
          let tN = generador.newTmp();
          generador.addIf(t0, '0', '<', LN);
          generador.addGoto(LP);
          generador.addLabel(LN);
          generador.addExpresion(tN, '1');
          generador.addExpresion(t0, t0, '*', '-1');
          generador.addGoto(LNX);
          generador.addLabel(LP);
          generador.addExpresion(tN, '0');
          generador.addLabel(LNX);
          // -------------------------------------------------

          let L1 = generador.newLabel();
          let L2 = generador.newLabel();
          let L3 = generador.newLabel();
          let L4 = generador.newLabel();
          generador.addLabel(L1);
          generador.addIf(t0, '10', '<', L2);
          generador.addGoto(L3);
          generador.addLabel(L2);
          let tmp0 = generador.newTmp();
          generador.addExpresion(tmp0, t0, '+', '48');
          generador.setToHeap('h', tmp0);
          generador.nextHeap();
          generador.addGoto(L4);
          //---------------------------------------
          generador.addLabel(L3);
          let t1 = generador.newTmp();
          let t2 = generador.newTmp();
          let t3 = generador.newTmp();
          let t4 = generador.newTmp();
          generador.addExpresion(t1, "(int) " + t0, '/', '10');
          generador.addExpresion(t2, t0, '/', '10');
          generador.addExpresion(t3, t2, '-', t1);
          generador.addExpresion(t4, t3, '*', '10');
          let tmp1 = generador.newTmp();
          generador.addExpresion(tmp1, t4, '+', '48');
          generador.setToHeap('h', tmp1);
          generador.nextHeap();
          generador.addExpresion(t0, t1);
          generador.addGoto(L1);
          generador.addLabel(L4);
          generador.addIf(tN, '1', '==', LN2);
          generador.addGoto(LP2);
          generador.addLabel(LN2);
          generador.setToHeap('h', '45');
          generador.nextHeap();
          generador.addLabel(LP2);

          // Termina guardado Al reves
          generador.setToHeap('h', '-1');
          generador.nextHeap();


          generador.addExpresion(tmpNumberRight, 'h');

          generador.addComment("------ Fin Concatenacion de number reversa ---------");

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

        } else if (leftValue.getTipo() == Tipo.NUMBER) {

          generador.addComment("------ Concatenacion de number ---------");

          let t0 = generador.newTmp();
          generador.addExpresion(t0, "(int)" + leftValue.getValor());
          //---------------------------------------------
          let LN = generador.newLabel();
          let LP = generador.newLabel();
          let LN2 = generador.newLabel();
          let LP2 = generador.newLabel();
          let LNX = generador.newLabel();
          let tN = generador.newTmp();
          generador.addIf(t0, '0', '<', LN);
          generador.addGoto(LP);
          generador.addLabel(LN);
          generador.addExpresion(tN, '1');
          generador.addExpresion(t0, t0, '*', '-1');
          generador.addGoto(LNX);
          generador.addLabel(LP);
          generador.addExpresion(tN, '0');
          generador.addLabel(LNX);
          // -------------------------------------------------
          let L1 = generador.newLabel();
          let L2 = generador.newLabel();
          let L3 = generador.newLabel();
          let L4 = generador.newLabel();
          generador.addLabel(L1);
          generador.addIf(t0, '10', '<', L2);
          generador.addGoto(L3);
          generador.addLabel(L2);
          let tmp0 = generador.newTmp();
          generador.addExpresion(tmp0, t0, '+', '48');
          generador.setToHeap('h', tmp0);
          generador.nextHeap();
          generador.addGoto(L4);
          //---------------------------------------
          generador.addLabel(L3);
          let t1 = generador.newTmp();
          let t2 = generador.newTmp();
          let t3 = generador.newTmp();
          let t4 = generador.newTmp();
          generador.addExpresion(t1, "(int) " + t0, '/', '10');
          generador.addExpresion(t2, t0, '/', '10');
          generador.addExpresion(t3, t2, '-', t1);
          generador.addExpresion(t4, t3, '*', '10');
          let tmp1 = generador.newTmp();
          generador.addExpresion(tmp1, t4, '+', '48');
          generador.setToHeap('h', tmp1);
          generador.nextHeap();
          generador.addExpresion(t0, t1);
          generador.addGoto(L1);
          generador.addLabel(L4);

          generador.addIf(tN, '1', '==', LN2);
          generador.addGoto(LP2);
          generador.addLabel(LN2);
          generador.setToHeap('h', '45');
          generador.nextHeap();
          generador.addLabel(LP2);

          // Termina guardado Al reves
          generador.setToHeap('h', '-1');
          generador.nextHeap();

          // Volvemos a recorrer el numero guardado
          tmp = generador.newTmp();
          generador.addExpresion(tmp, 'h');
          let tn = generador.newTmp();
          generador.addExpresion(tn, 'h', '-', '2');

          let LabelLoop = generador.newLabel();
          let label0 = generador.newLabel();
          let label1 = generador.newLabel();
          let tR = generador.newTmp();
          generador.addLabel(LabelLoop);
          generador.getFromHeap(tR, tn);
          generador.addIf(tR, '-1', '!=', label0);
          generador.addGoto(label1);
          generador.addLabel(label0);
          generador.setToHeap('h', tR);
          generador.nextHeap();
          generador.addExpresion(tn, tn, '-', '1');
          generador.addGoto(LabelLoop);
          generador.addLabel(label1);

          generador.addComment("------ Fin Concatenacion de number ---------");

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

          generador.addComment("------ Concatenacion de number ---------");

          // Volvemos a recorrer el numero guardado
          let tn = generador.newTmp();
          generador.addExpresion(tn, tmpNumberRight, '-', '2');

          let LabelLoop = generador.newLabel();
          let label0 = generador.newLabel();
          let label1 = generador.newLabel();
          let tR = generador.newTmp();
          generador.addLabel(LabelLoop);
          generador.getFromHeap(tR, tn);
          generador.addIf(tR, '-1', '!=', label0);
          generador.addGoto(label1);
          generador.addLabel(label0);
          generador.setToHeap('h', tR);
          generador.nextHeap();
          generador.addExpresion(tn, tn, '-', '1');
          generador.addGoto(LabelLoop);
          generador.addLabel(label1);

          generador.addComment("------ Fin Concatenacion de number ---------");

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
        generador.addExpresion(tmp, 'p', '+', entorno.size);  // cambio simulado de ambito

        let tmpParam1 = generador.newTmp();
        generador.addExpresion(tmpParam1, tmp, '+', '1');
        generador.setToStack(tmpParam1, leftValue.getValor());

        let tmpParam2 = generador.newTmp();
        generador.addExpresion(tmpParam2, tmp, '+', '2');
        generador.setToStack(tmpParam2, rightValue.getValor());

        generador.addExpresion('p', 'p', '+', entorno.size);  // Cambio de Ambito

        generador.addPotencia();

        let tmpRI = generador.newTmp();
        generador.addExpresion(tmpRI, 'p');

        let tmpR = generador.newTmp();
        generador.getFromStack(tmpR, tmpRI);

        generador.addExpresion('p', 'p', '-', entorno.size);  // Cambio de Ambito
        generador.addComment("--------- Fin Potencia --------------");
        result = new Retorno(tmpR, true, new Type(Tipo.NUMBER, null, 0));

      } else {
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede obtener potencia de: ' + entorno.getTipoDato(leftValue.getTipo()) + ' y ' + entorno.getTipoDato(rightValue.getTipo()));
      }
    }
    return result;
  }

  esNull(leftValue: Retorno, rightValue: Retorno) {
    if (leftValue.getTipo() == Tipo.NULL) {
      leftValue.valor = 0;
    }
    if (rightValue.getTipo() == Tipo.NULL) {
      rightValue.valor = 0;
    }
    return { leftValue, rightValue }
  }

  esBoolean(leftValue: Retorno, rightValue: Retorno) {
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