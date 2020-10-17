import { Expresion } from "../../Abstractos/Expresion";
import { Retorno, Tipo } from "../../Abstractos/Tipo";


export class Literal extends Expresion{
    
    constructor(private value : any, linea : number, columna: number, private tipo : any){
        super(linea, columna);
    }

    public traducir() : Retorno{
        if (this.tipo == Tipo.NUMBER) { 

        }
        else if (this.tipo == Tipo.BOOLEAN) { 

        }
        else if (this.tipo == Tipo.ARRAY) {

        }
        else if (this.tipo == 6) { //TIPO VOID PARA FUNCIONES
            return { value: this.value, tipo: Tipo.VOID }
        }
        else {
            // this.value.replace(/['"]+/g, '');
            return { value: this.value.replace(/["]+/g, '').replace(/[']+/g, ''), tipo: Tipo.STRING };
        }
    }
}