import { Simbolo } from "./Simbolo";
import { Tipo, tipoDominante, Type } from "../Utils/Tipo";
import { env } from "process";
import { Error_ } from "../Error/Error";
// import { Funcion } from "../Instrucciones/Funcion";
// import { Type } from "../Instrucciones/Type";
import { tipoDeclaracion } from "../Instrucciones/Variables/Declaracion";
import { Generador } from '../Generador/Generador';
import { Retorno } from '../Utils/Retorno';


export class Entorno {
  private variables: Map<string, Simbolo>;
  private anterior: Entorno | null;
  // private funciones: Map<string, Funcion>
  // private types: Map<string, Type>

  size: number;

  constructor(anterior: Entorno | null) {
    this.variables = new Map();
    this.anterior = anterior;
    // this.funciones = new Map();
    // this.types = new Map();
    this.size = anterior?.size || 0;
  }

  public getVariables() {
    return this.variables;
  }

  // public getFunciones() {
  //   return this.funciones;
  // }

  // public getTypes() {
  //   return this.types;
  // }

  public getAnterior(): Entorno | null {
    return this.anterior;
  }

  public asignarVariable(id: string, valor: any, tipo: any, linea: number, columna: number) {

  }

  public declararVariable(id: string, valor: Retorno, tipoType: Type, tipoVariable: tipoDeclaracion, linea: number, columna: number) {
    let entorno: Entorno | null = this;
    if (entorno != null) {
      if (entorno.variables.has(id)) {
        throw new Error_(linea, columna, 'Semántico', "Error en declaracion: variable " + id + " ya ha sido declarada.");
      }
    }

    let tipo = tipoType.tipo;

    if (tipo == Tipo.BOOLEAN || tipo == Tipo.NUMBER) { 
      
      this.variables.set(id, new Simbolo(id, tipoType, tipoVariable, this.size++, false, linea, columna));
      let generador = Generador.getInstance();
      generador.declararVariable(valor, this.size-1);
    } else {

    }
  }

  public getVariable(id: string) {
    let entorno: Entorno | null = this;
    while (entorno != null) {
      if (entorno.variables.has(id)) {
        return entorno.variables.get(id);
      }
      entorno = entorno.anterior;
    }
    return null;
  }

  public getVariableDeclaracion(id: string) {
    let entorno: Entorno | null = this;
    if (entorno.variables.has(id)) {
      return entorno.variables.get(id);
    }
    return null;
  }

  public getGlobal(): Entorno {
    let entorno: Entorno | null = this;
    while (entorno?.anterior != null) {
      entorno = entorno.anterior;
    }
    return entorno;
  }

  getTipoDato(tipo: any) {
    if (typeof tipo == 'number') {
      return Tipo[tipo];
    } else {
      return tipo;
    }
  }

}