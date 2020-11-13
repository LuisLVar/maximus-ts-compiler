import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Retorno } from "../../Utils/Retorno";


export class valorArray extends Expresion{
    
    constructor(private values : Array<Expresion>, private size : Expresion | null, linea : number, columna : number){
        super(linea, columna);
    }
    
    public traducir(entorno: Entorno): Retorno {
      let retorno: Retorno;

      return retorno;
    }
}
