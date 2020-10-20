import { Instruccion } from "../../Abstractos/Instruccion";
import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Generador } from 'src/Analizador/Generador/Generador';

export class Print extends Instruccion { 

  constructor(private values: Array<Expresion>, linea: number, columna: number) { 
    super(linea, columna)
  }

  public traducir(entorno: Entorno) {
    for (let e of this.values) { 
      console.log(e);
      let valor = e.traducir(entorno);
      console.log(valor);
      Generador.getInstance().Imprimir(valor.getTipo(), valor.getValor());
    }

  }

}