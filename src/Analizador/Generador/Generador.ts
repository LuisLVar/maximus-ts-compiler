import { Retorno } from '../Utils/Retorno';
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
    this.temporales = new Array();
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

  //Labels

  public newLabel() {
    let label = 'L' + this.label++;
    return label;
  }

  public addLabel(label: string) {
    this.code.push(`${label}:`);
  }

  public setEncabezado() {
    this.finalCode.push(`#include <stdio.h>\n`);
    this.finalCode.push(`double heap[16000];`);
    this.finalCode.push(`double stack[16000];`);
    this.finalCode.push(`double p;`);
    this.finalCode.push(`double h;`);
    this.declararTemporales();
    this.addMain();
  }

  public declararTemporales() {
    if (this.temporales.length > 0) {
      let codigo = 'double ' + this.temporales.join(',') + ";";
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

  public Imprimir(valor: Retorno) {
    let tipo = valor.getTipo();
    if (tipo == Tipo.NUMBER) {
      this.code.push(`printf("%f", (double)${valor.getValor()});`);
    } else if (tipo == Tipo.BOOLEAN) {
      this.addLabel(valor.trueLabel);
      this.code.push(`printf("true");`);
      let label = this.newLabel();
      this.addGoto(label);
      this.addLabel(valor.falseLabel);
      this.code.push(`printf("false");`);
      this.addLabel(label);
    } else if (tipo == Tipo.NULL) { 
      this.code.push(`printf("null");`);
    }
  }

  addEspacio() { 
    this.code.push(`printf("\\n");`);
  }

  liberarTmp(tmp: any) {
    if (this.tmpActivos.has(tmp)) {
      this.tmpActivos.delete(tmp);
    }
  }


  /* -----------    Expresiones  --------------- */

  addExpresion(asignable: string, left: any, operador: any, right: any) {
    this.code.push(`${asignable} = ${left} ${operador} ${right};`);
  }

  addGoto(label: any) {
    this.code.push(`goto ${label};`);
  }

  addIf(left: any, right: any, operador: string, label: string) {
    this.code.push(`if (${left}${operador}${right}) goto ${label};`);
  }

/* ------------ Declaracion y Asignacion de Variables -------------- */
  
  setToStack(tmp : any, valor: any) { 
    this.code.push(`stack[${tmp}]=${valor};`);
  }
  
  declararVariable(tmp : any, valor: Retorno) { 
    if (valor.getTipo() == Tipo.BOOLEAN) {
      this.addLabel(valor.trueLabel);
      this.setToStack(tmp, '1');
      let label = this.newLabel();
      this.addGoto(label);
      this.addLabel(valor.falseLabel);
      this.setToStack(tmp, '0');
      this.addLabel(label);
    } else if(valor.getTipo() == Tipo.NUMBER){ 
      this.setToStack(tmp, valor.getValor());
    }
  }

  asignarVariable(tmp : any, valor: Retorno) { 
    if (valor.getTipo() == Tipo.NUMBER) {
      this.setToStack(tmp, valor.getValor());
    } else if (valor.getTipo() == Tipo.BOOLEAN) { 
      this.addLabel(valor.trueLabel);
      this.setToStack(tmp, '1');
      let label = this.newLabel();
      this.addGoto(label);
      this.addLabel(valor.falseLabel);
      this.setToStack(tmp, '0');
      this.addLabel(label);
    }

  }


}
