import { Tipo } from "../Utils/Tipo"
import { tipoDeclaracion } from "../Instrucciones/Variables/Declaracion";

export class Simbolo { 

  constructor(private id: string, private tipo: any, private tipoVariable: tipoDeclaracion, private posRelativa: number,
    private heap: boolean, private linea, private column) { 

  }

  getID() { 
    return this.id;
  }

  getTipo() { 
    return this.tipo;
  }

  getTipoVariable() { 
    return this.tipoVariable;
  }

  getPosRelativa() {
    return this.posRelativa;
  }

  isHeap() { 
    return this.heap;
  }

  getLinea() { 
    return this.linea;
  }

  getColumna() { 
    return this.column;
  }

  
}