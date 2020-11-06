import { Error_ } from "src/Analizador/Error/Error";
import { Generador } from "src/Analizador/Generador/Generador";
import { Expresion } from "../../Abstractos/Expresion";
import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";

export class Call extends Instruccion{

    constructor(private id: string, private parametros : Array<Expresion>, linea : number, columna : number){
        super(linea, columna);
    }

    public traducir(entorno : Entorno) {
        const funcion = entorno.getFuncion(this.id, this.getLinea(), this.getColumna());

        //Funciones sin retorno, sencillas
        if (funcion.parametros.length != this.parametros.length) { 
            throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "Error en parametros: " +
            + "cantidad de parametos incorrecta, se esperaban " + funcion.parametros.length + " y se recibieron " +
            this.parametros.length);
        }

    // t20=p+1 --cambio simulado de ámbito (p+mi tamaño en memoria)
	// t21=t20+0
	// pila[t21]=5
	// t22=t20+1
	// pila[t22]=10
	// p=p+1   --cambio de ámbito
	// call int_multiplicacion_int_int()
	// t23=p+3
	// t24=pila[t23]
    // p=p-1   --cambio de ámbito
        
        const generador = Generador.getInstance();
        generador.addComment(`-------  Llamada a la funcion: ${funcion.id} -------`);
        let i = 1;
        //Cambio simulado de ambito
        let tmpAmbito = generador.newTmp();
        generador.addExpresion(tmpAmbito, 'p', '+', funcion.size);
        
        //Asignacion de parametros
        for (let param of this.parametros) { 
            let tmp = generador.newTmp();
            generador.addExpresion(tmp, tmpAmbito, '+', i);
            let expresion = param.traducir(entorno);
            generador.asignarVariable(tmp, expresion);
            i++;
        }
        //Cambio de ambito
        generador.addExpresion('p', 'p', '+', funcion.size);
        generador.code.push(`${funcion.callID}();`);
        generador.addExpresion('p', 'p', '-', funcion.size);
        generador.addComment("--------------------------------------");
        
        


    }
}
