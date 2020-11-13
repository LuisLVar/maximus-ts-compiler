import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Tipo, Type } from "../../Utils/Tipo";
import { Error_ } from "../../Error/Error";
import { Retorno } from "../../Utils/Retorno";
import { Generador } from "src/Analizador/Generador/Generador";

export class AccesoArray extends Expresion {

  constructor(private id: any, private indice: Expresion, private anterior: Expresion | null, line: number, column: number) {
    super(line, column);
  }

  public traducir(entorno: Entorno): Retorno {
    let retorno: Retorno;
    const generador = Generador.getInstance();

    if (this.anterior == null) {
      let variableTotal = entorno.getVariable(this.id);
      if (variableTotal == null) {
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "Error en acceso a array, variable no declarada: " + this.id);
      }
      let variable = variableTotal.variable;
      
      let indice = this.indice.traducir(entorno);

      
      let tmp = generador.newTmp();
      let tmpS = generador.newTmp();
      generador.addExpresion(tmp, 'p', '+', variable.getPosRelativa());
      generador.getFromStack(tmpS, tmp);
      let tmpH = generador.newTmp();

      let tmpRetorno = generador.newTmp();
      generador.addExpresion(tmpH, tmpS, '+', '2');
      generador.addExpresion(tmpH, tmpH, '+', indice.getValor());
      generador.getFromHeap(tmpRetorno, tmpH);

      retorno = new Retorno(tmpRetorno, true, new Type(variable.getTipo().tipoArray, null, 0));

    } else { 
      const anterior = this.anterior.traducir(entorno);
      const indice = this.indice.traducir(entorno);

      let tmpH = generador.newTmp();
      let tmpRetorno = generador.newTmp();
      generador.addExpresion(tmpH, anterior.getValor(),'+', indice.getValor());
      generador.addExpresion(tmpH, tmpH, '+', '2');
      generador.getFromHeap(tmpRetorno, tmpH);

      retorno = new Retorno(tmpRetorno, true, new Type(anterior.getTipo(), null, 0));

    }

    return retorno;


  }

}