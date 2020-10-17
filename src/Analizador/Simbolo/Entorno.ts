import { Simbolo } from "./Simbolo";
import { Tipo } from "../Abstractos/Tipo";
import { env } from "process";
import { Error_ } from "../Error/Error";
// import { Funcion } from "../Instrucciones/Funcion";
// import { Type } from "../Instrucciones/Type";
import { tipoDeclaracion } from "../Instrucciones/Variables/Declaracion";


export class Entorno {
  private variables: Map<string, Simbolo>;
  private anterior: Entorno | null;
  // private funciones: Map<string, Funcion>
  // private types: Map<string, Type>

  constructor(anterior: Entorno | null) {
    this.variables = new Map();
    this.anterior = anterior;
    // this.funciones = new Map();
    // this.types = new Map();
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
    let entorno: Entorno | null = this;
    while (entorno != null) {
      if (entorno.variables.has(id)) {
        entorno.variables.set(id, new Simbolo(valor, id, tipo, 1, linea, columna));
        return;
      }
      entorno = entorno.anterior;
    }
    throw new Error_(linea, columna, 'Semántico', "Error en asignacion: variable " + id + " no ha sido declarada.");
  }

  public declararVariable(id: string, valor: any, tipo: any, tipoVariable: tipoDeclaracion, linea: number, columna: number) {
    let entorno: Entorno | null = this;
    if (entorno != null) {
      if (entorno.variables.has(id)) {
        throw new Error_(linea, columna, 'Semántico', "Error en declaracion: variable " + id + " ya ha sido declarada.");
      }
    }
    this.variables.set(id, new Simbolo(valor, id, tipo, tipoVariable, linea, columna));
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