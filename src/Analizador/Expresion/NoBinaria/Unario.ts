import { Expresion } from "../../Abstractos/Expresion";
import { Tipo, Type } from "../../Utils/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";
import { Retorno } from "../../Utils/Retorno";
import { Generador } from 'src/Analizador/Generador/Generador';


export enum tipoUnario {
  UMENOS,
  UMAS,
  INC,
  DEC,
  NOT
}

export class Unario extends Expresion {

  constructor(private unario: Expresion, private tipo: tipoUnario, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno): Retorno {

    const generador = Generador.getInstance();
    let result: Retorno;
    if (this.tipo == tipoUnario.UMAS) {
      let value = this.unario.traducir(entorno);
      if (value.getTipo() == Tipo.NUMBER) {
        const tmp = generador.newTmp();
        generador.addExpresion(tmp, '0', '+',  value.getValor());
        result = new Retorno(tmp, true, new Type(value.getTipo(), null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se hacer positivo de: ' + entorno.getTipoDato(value.getTipo()));
      }
    }
    else if (this.tipo == tipoUnario.UMENOS) {
      let value = this.unario.traducir(entorno);
      if (value.getTipo() == Tipo.NUMBER) {
        const tmp = generador.newTmp();
        generador.addExpresion(tmp, '0', '-',  value.getValor());
        result = new Retorno(tmp, true, new Type(value.getTipo(), null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede hacer negativo de: ' + entorno.getTipoDato(value.getTipo()));
      }
    }
    else if (this.tipo == tipoUnario.INC) {
      let value = this.unario.traducir(entorno);
      if (value.getTipo() == Tipo.NUMBER) {
        const tmp = generador.newTmp();
        generador.addExpresion(tmp, value.getValor(), '+', '1');
        result = new Retorno(tmp, true, new Type(value.getTipo(), null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede incrementar: ' + entorno.getTipoDato(value.getTipo()));
      }
    }
    else if (this.tipo == tipoUnario.DEC) {
      let value = this.unario.traducir(entorno);
      if (value.getTipo() == Tipo.NUMBER) {
        const tmp = generador.newTmp();
        generador.addExpresion(tmp, value.getValor(), '-', '1');
        result = new Retorno(tmp, true, new Type(value.getTipo(), null, 0));
      } else { 
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'ArithmeticException: No se puede decrementar: ' + entorno.getTipoDato(value.getTipo()));
      }
    }
    else if (this.tipo == tipoUnario.NOT) {
      this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
      this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;

      this.unario.trueLabel = this.falseLabel;
      this.unario.falseLabel = this.trueLabel;

      let value = this.unario.traducir(entorno);
      if(value.getTipo() == Tipo.BOOLEAN){
          result = new Retorno('',false, value.getType());
          result.trueLabel = this.trueLabel;
          result.falseLabel = this.falseLabel;
          return result;
      }
      else
        throw new Error_(this.getLinea() ,this.getColumna() ,'Semantico',`Error NOT: tipo incorrecto: ${Tipo[value.getTipo()]}`);

    }
    else { 
      
    }
    return result;
  }
}