import { Entorno } from "src/Analizador/Simbolo/Entorno";
import { Tipo, Type } from "src/Analizador/Utils/Tipo";

export let consolaGlobal = { entrada: "", salida: "" }

export function Imprimir(cadena: string) {
  consolaGlobal.salida = consolaGlobal.salida + cadena + "\n";
}

export class SimboloTS {
  constructor(public nombre: string, public relativePos: any,
    public tipo: string, public dimension: any, public heap: any, public ambito: string, public linea: any, public columna: any,) {

  }

  getLinea() {
    return this.linea;
  }
}

export let tablaSimbolos: Array<SimboloTS> = new Array();

export let RaizAST = { raiz: null };


export function generarTS(entorno: Entorno) {
  let ambito = "Local";
  if (entorno.getAnterior() == null) {
    ambito = "Global";
  }
  let variables = entorno.getVariables();
  variables.forEach((value, key) => {
    let tipo: string;
    if (value.getTipo() instanceof Type) {
      tipo = Tipo[value.getTipo().getTipo()];
    } else {
      tipo = Tipo[value.getTipo()];
    }

    if (value.getTipo().tipo == Tipo.ARRAY) {
      tipo = "Array: " + Tipo[value.getTipo().tipoArray];
    }

    tablaSimbolos.push(new SimboloTS(value.getID(), value.getPosRelativa(),
      tipo, value.getTipo().dim, value.isHeap(), ambito, value.getLinea(), value.getColumna()));
  });

  let funciones = entorno.getFunciones();
  funciones.forEach((value, key) => {

    tablaSimbolos.push(new SimboloTS(value.id, '-',
      "Funcion: " + Tipo[value.tipo], '0', false, "Global", value.linea, value.columna));
  });

  //Ordenamiento
  let aux;
  for (let k = 1; k < tablaSimbolos.length; k++) {
    for (let i = 0; i < (tablaSimbolos.length - k); i++) {
      if (tablaSimbolos[i].linea > tablaSimbolos[i + 1].linea) {
        aux = tablaSimbolos[i]
        tablaSimbolos[i] = tablaSimbolos[i + 1];
        tablaSimbolos[i + 1] = aux;
      }
    }
  }
}
