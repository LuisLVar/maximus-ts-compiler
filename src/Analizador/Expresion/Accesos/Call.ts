import { Error_ } from "src/Analizador/Error/Error";
import { Generador } from "src/Analizador/Generador/Generador";
import { Simbolo } from "src/Analizador/Simbolo/Simbolo";
import { SimboloFuncion } from "src/Analizador/Simbolo/SimboloFuncion";
import { Retorno } from "src/Analizador/Utils/Retorno";
import { Tipo, Type } from "src/Analizador/Utils/Tipo";
import { Expresion } from "../../Abstractos/Expresion";
import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";

export class Call extends Instruccion {

    constructor(private id: string, private parametros: Array<Expresion>, linea: number, columna: number) {
        super(linea, columna);
    }

    public traducir(entorno: Entorno): Retorno {
        // console.log("Entro a un call");
        const funcion: SimboloFuncion = entorno.getFuncion(this.id, this.getLinea(), this.getColumna());
        // console.log(funcion);

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
        generador.addComment(`-------  Resguardamos Temporales -------`);
        let activos: Set<string> = new Set();
        //let guardados: Set<string> = new Set();
        for (let item of generador.tmpActivos) {
            let tmp = generador.newTmp();
            generador.addExpresion(tmp, 'p', '+', entorno.size++);
            entorno.variables.set("_" + item, new Simbolo(item, Tipo.TEMPORAL, 0, entorno.size - 1, false, this.getLinea(), this.getColumna()));
            generador.setToStack(tmp, item);
            activos.add(item);
            //guardados.add(item);
        }
        generador.addComment(`---------------------------------------`);
        generador.tmpActivos = activos;



        generador.addComment("Traduciendo Parametros");
        const retornos: any = new Array();
        //Traduccion de parametros
        console.log(this.parametros);
        for (let param of this.parametros) {
            let expresion = param.traducir(entorno);
            retornos.push(expresion);
        }

        //Cambio simulado de ambito
        let tmpAmbito = generador.newTmp();
        generador.addExpresion(tmpAmbito, 'p', '+', entorno.size);

        let i = 2;
        generador.addComment("Asignando Parametros");
        //Asignacion de parametros
        for (let expresion of retornos) {
            let tmp = generador.newTmp();
            generador.addExpresion(tmp, tmpAmbito, '+', i);
            generador.asignarVariable(tmp, expresion);
            i++;
        }

        generador.addComment("---------------------");

        let retorno: Retorno;

        //Cambio de ambito
        generador.addExpresion('p', 'p', '+', entorno.size);
        generador.callFuncion(funcion.callID);
        if (funcion.tipo != Tipo.VOID) {
            let tmp = generador.newTmp();
            generador.getFromStack(tmp, 'p');
            retorno = new Retorno(tmp, true, new Type(funcion.tipo, null, 0));
        } else {
            retorno = new Retorno('0', false, new Type(Tipo.VOID, null, 0));
        }
        generador.addExpresion('p', 'p', '-', entorno.size);

        generador.addComment("----------- Recuperacion de temporales ----------------");
        //Aqui debo recuperar valores.
        console.log(entorno.variables);
        for (let item of generador.tmpActivos) {
            console.log("_" + item);
            let temporal = entorno.getVariable("_" + item);
            if (temporal != null) {
                let tmp = generador.newTmp();
                generador.addExpresion(tmp, 'p', '+', temporal.variable.getPosRelativa());
                generador.getFromStack(item, tmp);
            }

        }

        generador.addComment("-------------------------------------------------------");
        return retorno;

    }
}
