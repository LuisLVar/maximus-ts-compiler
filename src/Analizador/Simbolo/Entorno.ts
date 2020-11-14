import { Simbolo } from "./Simbolo";
import { Tipo, tipoDominante, Type } from "../Utils/Tipo";
import { Error_ } from "../Error/Error";
import { Funcion } from "../Instrucciones/Funciones/Funcion";
import { SimboloFuncion } from "./SimboloFuncion";


export class Entorno {
  variables: Map<string, Simbolo>;
  anterior: Entorno | null;
  funciones: Map<string, SimboloFuncion>
  // private types: Map<string, Type>

  size: number;
  break: string | null;
  continue: string | null;
  retorno: string | null;
  esFuncion: boolean;
  esGlobal: boolean;

  constructor(anterior: Entorno | null) {
    this.variables = new Map();
    this.anterior = anterior;
    this.funciones = new Map();
    // this.types = new Map();
    this.size = anterior?.size || 0;
    this.esFuncion = false;
  }

  public getVariables() {
    return this.variables;
  }

  public getFunciones() {
    return this.funciones;
  }

  // public getTypes() {
  //   return this.types;
  // }

  public getAnterior(): Entorno | null {
    return this.anterior;
  }


  public getVariable(id: string) {
    let entorno: Entorno | null = this;
    let esGlobal = false;
    while (entorno != null) {
      if (entorno.variables.has(id)) {
        if (entorno.anterior == null) { 
          esGlobal = true;
        }
        return { variable: entorno.variables.get(id), global: esGlobal};
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

    // FUNCIONES

    public guardarFuncion(id: string, funcion: any, callID: string, linea: number, columna: number) {
      let entorno: Entorno | null = this;
      if (entorno != null) {
        if (entorno.funciones.has(id.toLowerCase())) {
          throw new Error_(linea, columna, 'Semántico', "Error en declaracion: funcion " + id + " ya ha sido declarada.");
        }
      }
      this.funciones.set(id.toLowerCase(), new SimboloFuncion(funcion, callID, linea, columna));
    }
  
    public getFuncion(id: string, linea: number, columna: number): SimboloFuncion | undefined {
      let entorno: Entorno | null = this;
      while (entorno != null) {
        if (entorno.funciones.has(id.toLowerCase())) {
          return entorno.funciones.get(id.toLowerCase());
        }
        entorno = entorno.anterior;
      }
      throw new Error_(linea, columna, 'Semántico', "Error en llamada: funcion " + id + " no esta definida.");
    }

}