import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Retorno } from "../../Abstractos/Tipo";
import { Error_ } from "../../Error/Error";

export class Variable extends Expresion{

    constructor(private id: string, line : number, column: number){
        super(line, column);
    }

    public traducir(entorno: Entorno): Retorno {
        const value = entorno.getVariable(this.id);
        if (value == null) {
            throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "La variable '" + this.id + "' no ha sido declarada.");
        }
        return {value : value.getValor(), tipo : value.getTipo()};
    }
}