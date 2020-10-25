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
  variables: Map<string, Simbolo>;
  anterior: Entorno | null;
  // private funciones: Map<string, Funcion>
  // private types: Map<string, Type>

  size: number;
  break: string | null;
  continue: string | null;

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