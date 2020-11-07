import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Retorno } from "../../Utils/Retorno";
import { Error_ } from "../../Error/Error";
import { Tipo, Type } from "../../Utils/Tipo";
import { Generador } from 'src/Analizador/Generador/Generador';

export class Variable extends Expresion{

    constructor(private id: string, line : number, column: number){
        super(line, column);
    }

    public traducir(entorno: Entorno): Retorno {
        let variableTotal = entorno.getVariable(this.id);
        let variable = variableTotal.variable;
        let result: Retorno;
        if (variable == null) {
            throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "La variable '" + this.id + "' no ha sido declarada.");
        }

        let tipo = variable.getTipo().getTipo();
        const generador = Generador.getInstance();

        let tmp = generador.newTmp();
        if (entorno.esFuncion && variableTotal.global) {
            //Obtengo P global
            let tmpG = generador.newTmp();
            generador.addExpresion(tmpG, 'p', '+', '1');
            let tmpG1 = generador.newTmp();
            generador.getFromStack(tmpG1, tmpG);
            generador.addExpresion(tmp, tmpG1, '+', variable.getPosRelativa());
        } else { 
            generador.addExpresion(tmp, 'p', '+', variable.getPosRelativa());
        }


        let tmp2 = generador.newTmp();
        generador.getFromStack(tmp2, tmp);
            
        if (tipo == Tipo.BOOLEAN) { 
            result = new Retorno('',false, new Type(tipo, null, 0));
            this.trueLabel = this.trueLabel == '' ? generador.newLabel() : this.trueLabel;
            this.falseLabel = this.falseLabel == '' ? generador.newLabel() : this.falseLabel;
            generador.addIf(tmp2,'1', '==', this.trueLabel);
            generador.addGoto(this.falseLabel);
            result.trueLabel = this.trueLabel;
            result.falseLabel = this.falseLabel;
            this.retornoLabel = result.retornoLbl = generador.newLabel();
            generador.addLabel(this.retornoLabel);
            return result;
        }
        else if (tipo == Tipo.STRING) { 
            return new Retorno(tmp2, true, new Type(tipo, null, 0));
        }
        else if (tipo == Tipo.NULL) {
            return new Retorno( "0", false, new Type(tipo, null, 0));
        }
        else {
            return new Retorno(tmp2, true, new Type(tipo, null, 0));
        }
        return result;
    }
}