import { Funcion } from "../Instrucciones/Funciones/Funcion";
import { Parametro } from "../Instrucciones/Funciones/Parametro";
import { Tipo } from "../Utils/Tipo"

export class SimboloFuncion {
  tipo: Tipo;
  id: string;
  callID: string;
  size: number;
  parametros: Array<Parametro>;

  constructor(funcion: Funcion,  callID : string) {
      this.tipo = funcion.getTipo();
      this.id = funcion.getID();
      this.size = funcion.parametros.length;
      this.callID = callID;
      this.parametros = funcion.parametros;
  }
}