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
    if (this.tipo == tipoRelacional.IGUALIGUAL) {
      this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
      this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
      generador.addIf(leftValue.getValor(), rightValue.getValor(), '==', this.trueLabel);
      generador.addGoto(this.falseLabel);
      result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
      result.trueLabel = this.trueLabel;
      result.falseLabel = this.falseLabel;
      return result;
    }
    else if (this.tipo == tipoRelacional.DESIGUAL) {
      this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
      this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
      generador.addIf(leftValue.getValor(), rightValue.getValor(), '!=', this.trueLabel);
      generador.addGoto(this.falseLabel);
      result = new Retorno('', false, new Type(Tipo.BOOLEAN, null, 0));
      result.trueLabel = this.trueLabel;
      result.falseLabel = this.falseLabel;
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