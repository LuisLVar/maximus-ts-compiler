import { Expresion } from "../../Abstractos/Expresion";
import { Tipo, Type } from "../../Utils/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";
import { Retorno } from "../../Utils/Retorno";
import { Generador } from 'src/Analizador/Generador/Generador';


export enum tipoRelacional {
  MAYORQUE,
  MENORQUE,
  MAYORIGUAL,
  MENORIGUAL,
  IGUALIGUAL,
  DESIGUAL
}

export class Relacional extends Expresion {

  constructor(private left: Expresion, private right: Expresion, private tipo: tipoRelacional, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno): Retorno {
    const leftValue = this.left.traducir(entorno);
    const rightValue = this.right.traducir(entorno);
    const generador = Generador.getInstance();
    let result: Retorno;

    //TODO Vadar tipos, diferenciacion y igualacion

    if (this.tipo == tipoRelacional.IGUALIGUAL) {

      if (leftValue.getTipo() == Tipo.BOOLEAN && rightValue.getTipo() == Tipo.BOOLEAN) {
        let tmp = generador.newTmp();
        let label = generador.newLabel();
        generador.addLabel(leftValue.trueLabel);
        generador.addExpresion(tmp, '1');
        generador.addGoto(label);
        generador.addLabel(leftValue.falseLabel);
        generador.addExpresion(tmp, '0');
        generador.addLabel(label);

        let tmp2 = generador.newTmp();
        let label2 = generador.newLabel();
        generador.addLabel(rightValue.trueLabel);
        generador.addExpresion(tmp2, '1');
        generador.addGoto(label2);
        generador.addLabel(rightValue.falseLabel);
        generador.addExpresion(tmp2, '0');
        generador.addLabel(label2);

        this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
        generador.addIf(tmp, tmp2, '==', this.trueLabel);
        generador.addGoto(this.falseLabel);
        result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
        result.trueLabel = this.trueLabel;
        result.falseLabel = this.falseLabel;


      } else {
        this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
        generador.addIf(leftValue.getValor(), rightValue.getValor(), '==', this.trueLabel);
        generador.addGoto(this.falseLabel);
        result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
        result.trueLabel = this.trueLabel;
        result.falseLabel = this.falseLabel;
      }

      return result;
    }
    else if (this.tipo == tipoRelacional.DESIGUAL) {

      if (leftValue.getTipo() == Tipo.BOOLEAN && rightValue.getTipo() == Tipo.BOOLEAN) {
        let tmp = generador.newTmp();
        let label = generador.newLabel();
        generador.addLabel(leftValue.trueLabel);
        generador.addExpresion(tmp, '1');
        generador.addGoto(label);
        generador.addLabel(leftValue.falseLabel);
        generador.addExpresion(tmp, '0');
        generador.addLabel(label);

        let tmp2 = generador.newTmp();
        let label2 = generador.newLabel();
        generador.addLabel(rightValue.trueLabel);
        generador.addExpresion(tmp2, '1');
        generador.addGoto(label2);
        generador.addLabel(rightValue.falseLabel);
        generador.addExpresion(tmp2, '0');
        generador.addLabel(label2);

        this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
        generador.addIf(tmp, tmp2, '!=', this.trueLabel);
        generador.addGoto(this.falseLabel);
        result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
        result.trueLabel = this.trueLabel;
        result.falseLabel = this.falseLabel;
      } else {
        this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
        this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
        generador.addIf(leftValue.getValor(), rightValue.getValor(), '!=', this.trueLabel);
        generador.addGoto(this.falseLabel);
        result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
        result.trueLabel = this.trueLabel;
        result.falseLabel = this.falseLabel;
      }
      return result;
    }
    else if (this.tipo == tipoRelacional.MAYORQUE) {
      this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
      this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
      generador.addIf(leftValue.getValor(), rightValue.getValor(), '>', this.trueLabel);
      generador.addGoto(this.falseLabel);
      result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
      result.trueLabel = this.trueLabel;
      result.falseLabel = this.falseLabel;
      return result;
    }
    else if (this.tipo == tipoRelacional.MENORQUE) {
      this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
      this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
      generador.addIf(leftValue.getValor(), rightValue.getValor(), '<', this.trueLabel);
      generador.addGoto(this.falseLabel);
      result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
      result.trueLabel = this.trueLabel;
      result.falseLabel = this.falseLabel;
      return result;
    }
    else if (this.tipo == tipoRelacional.MAYORIGUAL) {
      this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
      this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
      generador.addIf(leftValue.getValor(), rightValue.getValor(), '>=', this.trueLabel);
      generador.addGoto(this.falseLabel);
      result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
      result.trueLabel = this.trueLabel;
      result.falseLabel = this.falseLabel;
      return result;
    }
    else if (this.tipo == tipoRelacional.MENORIGUAL) {
      this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
      this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
      generador.addIf(leftValue.getValor(), rightValue.getValor(), '<=', this.trueLabel);
      generador.addGoto(this.falseLabel);
      result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
      result.trueLabel = this.trueLabel;
      result.falseLabel = this.falseLabel;
      return result;
    }
    return result;
  }
}