import { Expresion } from "../../Abstractos/Expresion";
import { Tipo, Type } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";


export class Literal extends Expresion{
    
    constructor(private value : any, linea : number, columna: number, private tipo : Tipo){
        super(linea, columna);
    }

    public traducir(): Retorno{
        let result: Retorno;
        if (this.tipo == Tipo.BOOLEAN) { 
            // return { tmp: this.value, tipo: Tipo.NUMBER }
        }
        else if (this.tipo == Tipo.STRING) { 
            // return { tmp: this.value, tipo: Tipo.BOOLEAN }
        }
        else if (this.tipo == Tipo.NULL) {
            // return { tmp: this.value, tipo: Tipo.NULL }
        }
        else {
            return new Retorno(this.value, false, new Type(this.tipo));
        }
        return result;
    }
}