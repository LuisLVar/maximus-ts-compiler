import { Tipo } from "../Utils/Tipo"
import { contador } from "./Contador"

export class Nodo { 

  private nombre: string;
  private hijos: Array<Nodo>;
  private id: number;
  constructor(nombre: string) { 
    this.nombre = nombre;
    this.hijos = new Array();
    this.id = this.getContador();
  }

  getContador() { 
    contador.contador = contador.contador +1;
    return contador.contador;
  }

  getId() { 
    return this.id;
  }

  getNombre() { 
    return this.nombre;
  }

  getHijos() { 
    return this.hijos;
  }

  newHijo(hijo : Nodo) { 
    this.hijos.push(hijo);
  }
}