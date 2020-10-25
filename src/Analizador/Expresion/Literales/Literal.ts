import { Expresion } from "../../Abstractos/Expresion";
import { Tipo, Type } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";
import { Generador } from 'src/Analizador/Generador/Generador';


export class Literal extends Expresion{
    
    constructor(private value : any, linea : number, columna: number, private tipo : Tipo){
        super(linea, columna);
    }

    public traducir(): Retorno{
        let result: Retorno;
        if (this.tipo == Tipo.BOOLEAN) { 
            console.log("Literal booleana");
            const generator = Generador.getInstance();
            result = new Retorno('',false, new Type(this.tipo, null, 0));
            this.trueLabel = this.trueLabel == '' ? generator.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? generator.newLabel() : this.falseLabel;
            this.value == "true" ? generator.addGoto(this.trueLabel) : generator.addGoto(this.falseLabel);
            result.trueLabel = this.trueLabel;
            result.falseLabel = this.falseLabel;
            return result;
        }
        else if (this.tipo == Tipo.STRING) { 
            // return { tmp: this.value, tipo: Tipo.BOOLEAN }
        }
        else if (this.tipo == Tipo.NULL) {
            return new Retorno( '0', false, new Type(this.tipo, null, 0));
        }
        else {
            return new Retorno(this.value, false, new Type(this.tipo, null, 0));
        }
        return result;
    }
}