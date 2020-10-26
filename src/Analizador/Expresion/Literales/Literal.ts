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
        const generador = Generador.getInstance();
        if (this.tipo == Tipo.BOOLEAN) { 
            result = new Retorno('',false, new Type(this.tipo, null, 0));
            this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
            this.value == "true" ? generador.addGoto(this.trueLabel) : generador.addGoto(this.falseLabel);
            result.trueLabel = this.trueLabel;
            result.falseLabel = this.falseLabel;
            return result;
        }
        else if (this.tipo == Tipo.STRING) { 
            let tmp = generador.newTmp();
            generador.addExpresion(tmp, 'h');
            let valor = this.value.replace(/["]+/g, '').replace(/[']+/g, '');
            for (let caracter of valor) { 
                generador.setToHeap('h', caracter.charCodeAt(0));
                generador.nextHeap();
            }
            generador.setToHeap('h', '-1');
            generador.nextHeap();
            return new Retorno(tmp, true, new Type(Tipo.STRING, null, 0));
        }
        else if (this.tipo == Tipo.NULL) {
            return new Retorno( '0', false, new Type(this.tipo, null, 0));
        }
        else {
            return new Retorno(this.value, false, new Type(this.tipo, null, 0));
        }
        // return result;
    }
}