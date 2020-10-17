import { Tipo } from "../Abstractos/Tipo"
import { tipoDeclaracion } from "../Instrucciones/Variables/Declaracion";

export class Simbolo { 

  constructor(public value: any, private id: string, private tipo: any, private tipoVariable: tipoDeclaracion, private linea: number, private columna: number) { 

  }

  getValor() { 
    return this.value;
  }

  getID() { 
    return this.id;
  }

  getTipo() { 
    return this.tipo;
  }

  getLinea() { 
    return this.linea;
  }


  getColumna() { 
    return this.columna;
  }

  getTipoVariable() { 
    return this.tipoVariable;
  }
}