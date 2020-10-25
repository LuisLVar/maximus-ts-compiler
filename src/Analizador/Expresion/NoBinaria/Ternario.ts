import { Expresion } from "../../Abstractos/Expresion";
import { Tipo } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";
import { Generador } from 'src/Analizador/Generador/Generador';

export class Ternario extends Expresion {

  constructor(private condicion: Expresion, private exp1: Expresion, private exp2: Expresion, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno) : Retorno {
    let retorno: Retorno;

    let condicion = this.condicion.traducir(entorno);
    if (condicion.getTipo() != Tipo.BOOLEAN) { 
      throw new Error_(this.getLinea() ,this.getColumna() ,'Semantico',`Error Ternario: condicion debe ser booleana: ${Tipo[condicion.getTipo()]}`);
    }

    const generador = Generador.getInstance();
    generador.addLabel(condicion.trueLabel);
    let exp1 = this.exp1.traducir(entorno);
    let tmp = generador.newTmp();
    generador.addExpresion(tmp, '', '', exp1.getValor());
    let label = generador.newLabel();
    generador.addGoto(label);
    generador.addLabel(condicion.falseLabel);
    let exp2 = this.exp2.traducir(entorno);
    generador.addExpresion(tmp, '', '', exp2.getValor());
    generador.addLabel(label);

    if (exp1.getTipo() != exp2.getTipo()) { 
      throw new Error_(this.getLinea() ,this.getColumna() ,'Semantico',`Error Ternario: tipos en expresiones no son iguales`);
    }

    retorno = new Retorno(tmp, true, exp2.getType());
    return retorno;

  }
}