import { Expresion } from "../../Abstractos/Expresion";
import { Tipo } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";
import { Generador } from 'src/Analizador/Generador/Generador';


export enum tipoLogica {
  AND,
  OR
}

export class Logica extends Expresion {

  constructor(private left: Expresion, private right: Expresion, private tipo: tipoLogica, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno): Retorno {


    const generador = Generador.getInstance();
    let result: Retorno;
    if (this.tipo == tipoLogica.AND) {
      this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
      this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;

      this.left.trueLabel = generador.newLabel();
      this.right.trueLabel = this.trueLabel;
      this.left.falseLabel = this.right.falseLabel = this.falseLabel;

      const leftValue = this.left.traducir(entorno);
      generador.addLabel(this.left.trueLabel);
      const rightValue = this.right.traducir(entorno);

      if (leftValue.getTipo() == Tipo.BOOLEAN && rightValue.getTipo() == Tipo.BOOLEAN) {
        const result = new Retorno('', false, rightValue.getType());
        result.trueLabel = this.trueLabel;
        result.falseLabel = this.right.falseLabel;
        return result;
      }
      else
        throw new Error_(this.getLinea(), this.getColumna(), 'Semantico', `Error Expresion Logica -> And: ${Tipo[leftValue.getTipo()]} && ${Tipo[rightValue.getTipo()]}`);

    }
    else if (this.tipo == tipoLogica.OR) {
      this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
      this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;

      this.left.trueLabel = this.right.trueLabel = this.trueLabel;
      this.left.falseLabel = generador.newLabel();
      this.right.falseLabel = this.falseLabel;

      let leftValue = this.left.traducir(entorno);
      generador.addLabel(this.left.falseLabel);
      let rightValue = this.right.traducir(entorno);

      if(leftValue.getTipo() == Tipo.BOOLEAN && rightValue.getTipo() == Tipo.BOOLEAN){
        const retorno = new Retorno('', false, leftValue.getType());
          retorno.trueLabel = this.trueLabel;
          retorno.falseLabel = this.right.falseLabel;
          return retorno;
      }
      throw new Error_(this.getLinea(), this.getColumna(), 'Semantico', `No se puede Or: ${Tipo[leftValue.getTipo()]} || ${Tipo[rightValue.getTipo()]}`);
    }
    console.log("Entro en el que no deberia");
    return result;
  }
}