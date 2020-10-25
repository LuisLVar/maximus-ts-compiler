import { Error_ } from "../../Error/Error";
import { Entorno } from "../../Simbolo/Entorno";
import { Instruccion } from "../../Abstractos/Instruccion";
import { Generador } from "../../Generador/Generador";

export class Continue extends Instruccion{

    constructor(private line: number, private column: number){
        super(line,column);
    }

    traducir(entorno: Entorno) : void{
        if(entorno.break == null){ 
            throw new Error_(this.getLinea(),this.getColumna(),'Semantico','Error Continue: ambito incorrecto');
        }
        Generador.getInstance().addGoto(entorno.continue);
    }
}