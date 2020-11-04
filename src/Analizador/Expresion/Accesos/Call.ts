import { Expresion } from "../../Abstractos/Expresion";
import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";

export class Call extends Instruccion{

    constructor(private id: string, private parametros : Array<Expresion>, linea : number, columna : number){
        super(linea, columna);
    }

    public traducir(entorno : Entorno) {
 
    }
}
