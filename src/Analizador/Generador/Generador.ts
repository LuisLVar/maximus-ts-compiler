import { Tipo } from '../Utils/Tipo';

export class Generador {
  private static generador: Generador;
  private temporal: number;
  private label: number;
  private code: string[];
  private finalCode: string[];
  private tmpActivos: Set<string>;
  private temporales: string[];

  private constructor() {
    this.temporal = this.label = 0;
    this.code = new Array();
    this.finalCode = new Array();
    this.tmpActivos = new Set();
    this.temporales = new Array();
    
  }

  public static getInstance() {
    return this.generador || (this.generador = new this());
  }

  getTmpActivos() {
    return this.tmpActivos;
  }

  limpiarTmpActivos() {
    this.tmpActivos.clear();
  }

  public limpiarGenerador() {
    this.temporal = this.label = 0;
    this.code = new Array();
    this.finalCode = new Array();
    this.tmpActivos = new Set();
  }

  public getCode(): string {
    this.setEncabezado();
    return this.finalCode.join('\n');
  }

  public newTmp() { 
    let tmp = 'T' + this.temporal++;
    this.tmpActivos.add(tmp);
    this.temporales.push(tmp);
    return tmp;
  }

  public newLabel() {
    let label = 'L' + this.label++;
    return label;
  }

  public setEncabezado() { 
    this.finalCode.push(`#include <stdio.h>\n`);
    this.finalCode.push(`float heap[16000];`);
    this.finalCode.push(`float stack[16000];`);
    this.finalCode.push(`float p;`);
    this.finalCode.push(`float h;`);
    this.declararTemporales();
    this.addMain();
  }

  public declararTemporales() {
    if (this.temporales.length > 0) { 
      let codigo = 'float ' + this.temporales.join(',') + ";";
      this.finalCode.push(codigo);
    }
  }

  public addMain() { 
    console.log("Main:");
    console.log(this.code);
    this.finalCode.push(`\nvoid main(){`);
    Array.prototype.push.apply(this.finalCode, this.code)
    this.finalCode.push(`return;`);
    this.finalCode.push(`}`);
  }

  public Imprimir(tipo: Tipo, valor: any) { 
    if (tipo == Tipo.NUMBER) {
      this.code.push(`printf("%f", (float)${valor});`);
    } else { 

    }

  }

  liberarTmp(tmp: any) { 
    if (this.tmpActivos.has(tmp)) {
      this.tmpActivos.delete(tmp);
    }
  }


/* -----------    Expresiones  --------------- */
  
  addExpresion(asignable : string, left : any, operador : any, right : any) { 
    this.code.push(`${asignable} = ${left} ${operador} ${right};`);
  }


}
