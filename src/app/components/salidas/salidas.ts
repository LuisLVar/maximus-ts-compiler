export let consolaGlobal   = { entrada: "", salida: ""}

export function Imprimir(cadena: string) { 
  consolaGlobal.salida = consolaGlobal.salida + cadena + "\n";
}

export class SimboloTS {
  constructor(private nombre: string, private tipo: string, private ambito: string, private linea: any) { 
    
  }

  getLinea() { 
    return this.linea;
  }
}

export let tablaSimbolos: Array<SimboloTS> = new Array();

export let ListTS: any = new Array();

export let RaizAST = {raiz: null};