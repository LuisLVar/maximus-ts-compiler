import { Instruccion } from "../../Abstractos/Instruccion";
import { Tipo } from "../../Utils/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Parametro } from "./Parametro";

export class Funcion extends Instruccion{

  constructor(private id: string, private cuerpo: Instruccion, public parametros: Array<Parametro>, private tipo: any,
    linea: number, columna: number) {
        super(linea, columna);
    }

    public traducir(entorno : Entorno) {
      // entorno.guardarFuncion(this.id, this, this.getLinea(), this.getColumna());
    }
  
  getCuerpo() { 
    return this.cuerpo;
  }

  getTipo() { 
    return this.tipo;
  }

  getID() { 
    return this.id;
  }

  setTipo(tipo: any) { 
    this.tipo = tipo;
  }
  
    
} 