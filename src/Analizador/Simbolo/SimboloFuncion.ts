import { Funcion } from "../Instrucciones/Funciones/Funcion";
import { Parametro } from "../Instrucciones/Funciones/Parametro";
import { Tipo } from "../Utils/Tipo"

export class SimboloFuncion {
  tipo: any;
  tipoArray: any;
  dim: any;
  id: string;
  callID: string;
  size: number;
  parametros: Array<Parametro>;

  constructor(funcion: Funcion, callID: string, public linea: any, public columna: any) {
    this.tipo = funcion.getTipo();
    this.dim = funcion.getDimension();
    if (this.dim > 0) {
      this.tipo = Tipo.ARRAY;
      this.tipoArray = funcion.getTipo();
    }
    this.id = funcion.getID();
    this.size = funcion.parametros.length;
    this.callID = callID;
    this.parametros = funcion.parametros;
  }
}