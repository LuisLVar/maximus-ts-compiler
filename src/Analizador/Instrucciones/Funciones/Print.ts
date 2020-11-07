import { Instruccion } from "../../Abstractos/Instruccion";
import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Generador } from 'src/Analizador/Generador/Generador';

export class Print extends Instruccion { 

  constructor(private values: Array<Expresion>, linea: number, columna: number) { 
    super(linea, columna)
  }

  public traducir(entorno: Entorno) {
    let generador = Generador.getInstance();
    for (let e of this.values) { 
      let valor = e.traducir(entorno);
      generador.Imprimir(valor, entorno.size);
    }
    generador.addEspacio();
  }

}