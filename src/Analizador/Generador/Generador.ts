import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Retorno } from '../Utils/Retorno';
import { Tipo } from '../Utils/Tipo';

enum codigo {
  CODE = 0,
  FUNCION = 1,
  TYPE = 2
}

export class Generador {
  private static generador: Generador;
  private temporal: number;
  private label: number;
  code: string[];
  codeFunciones: string[];
  private tmpActivos: Set<string>;
  private temporales: string[];
  estado: number;
  

  private constructor() {
    this.temporal = this.label = 0;
    this.code = new Array();
    this.codeFunciones = new Array();
    this.tmpActivos = new Set();
    this.temporales = new Array();
    this.estado = 0;
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
    this.codeFunciones = new Array();
    this.tmpActivos = new Set();
    this.temporales = new Array();
  }

  public getCode(): string {
    return this.code.join('\n');
  }

  public newTmp() {
    let tmp = 'T' + this.temporal++;
    this.tmpActivos.add(tmp);
    this.temporales.push(tmp);
    return tmp;
  }

  //Labels

  newLabel() {
    let label = 'L' + this.label++;
    return label;
  }

  setCode() { 
    let code;
    if (this.estado == codigo.CODE) {
      code = this.code;
    } else if (this.estado == codigo.FUNCION) { 
      code = this.codeFunciones;
    }
    return code;
  }

  addLabel(label: string) {
    const code = this.setCode();
    code.push(`${label}:`);
  }

  setEncabezado() {
    this.code.push(`#include <stdio.h>`);
    this.code.push(`#include <math.h>\n`);
    this.code.push(`double heap[16000];`);
    this.code.push(`double stack[16000];`);
    this.code.push(`double p;`);
    this.code.push(`double h;`);  
  }

  declararTemporales() {
    if (this.temporales.length > 0) {
      let codigo = 'double ' + this.temporales.join(',') + ";";
      // code.push(codigo);
      this.code.splice(6, 0, codigo);
    }
  }

  addMain() {
    this.code.push(`\nvoid main(){`);
  }

  addMainEnd() { 
    this.code.push(`return;`);
    this.code.push(`}`);
  }

  Imprimir(valor: Retorno, size: any) {
    const code = this.setCode();
    let tipo = valor.getTipo();
    if (tipo == Tipo.NUMBER) {
      code.push(`printf("%f", (double)${valor.getValor()});`);
    } else if (tipo == Tipo.BOOLEAN) {
      this.addComment("--------- Print Boolean --------------");
      this.addLabel(valor.trueLabel);
      code.push(`printf("true");`);
      let label = this.newLabel();
      this.addGoto(label);
      this.addLabel(valor.falseLabel);
      code.push(`printf("false");`);
      this.addLabel(label);
      this.addComment("--------- Print Boolean --------------");

    } else if (tipo == Tipo.NULL) {
      code.push(`printf("null");`);

    } else if (tipo == Tipo.STRING) {
      this.addComment("--------- Print String --------------");
      let tmp = this.newTmp();
      this.addExpresion(tmp, 'p', '+', size);
      this.setToStack(tmp, valor.getValor());
      this.addExpresion('p', 'p', '+', size);
      code.push("_nativaPrintString();");
      this.addExpresion('p', 'p', '-', size);
      this.addComment("--------- Fin Print String --------------");
    }
  }

  addEspacio() {
    const code = this.setCode();
    code.push(`printf("\\n");`);
  }

  liberarTmp(tmp: any) {
    if (this.tmpActivos.has(tmp)) {
      this.tmpActivos.delete(tmp);
    }
  }


  /* -----------    Expresiones  --------------- */

  addExpresion(asignable: string, left: any, operador: any = '', right: any = '') {
    const code = this.setCode();
    code.push(`${asignable} = ${left} ${operador} ${right};`);
  }

  addModulo(tmp: any, left: any, right: any) {
    const code = this.setCode();
    code.push(`${tmp} = fmod(${left},${right});`);
  }

  addGoto(label: any) {
    const code = this.setCode();
    code.push(`goto ${label};`);
  }

  addIf(left: any, right: any, operador: string, label: string) {
    const code = this.setCode();
    code.push(`if (${left}${operador}${right}) goto ${label};`);
  }

  /* ------------ Declaracion y Asignacion de Variables -------------- */

  setToStack(tmp: any, valor: any) {
    const code = this.setCode();
    code.push(`stack[(int)${tmp}]=${valor};`);
  }

  getFromStack(tmp: any, posicion: any) {
    const code = this.setCode();
    code.push(`${tmp} = stack[(int)${posicion}];`);
  }

  declararVariable(tmp: any, valor: Retorno) {
    if (valor.getTipo() == Tipo.BOOLEAN) {
      this.addLabel(valor.trueLabel);
      this.setToStack(tmp, '1');
      let label = this.newLabel();
      this.addGoto(label);
      this.addLabel(valor.falseLabel);
      this.setToStack(tmp, '0');
      this.addLabel(label);
    } else {
      this.setToStack(tmp, valor.getValor());
    }
  }

  asignarVariable(tmp: any, valor: Retorno) {
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
    } else if (valor.getTipo() == Tipo.STRING) {
      this.setToStack(tmp, valor.getValor());

    }
  }

  addComment(texto: string) {
    const code = this.setCode();
    code.push(`// ${texto}`);
  }

  // ------------ HEAP -----------------
  nextHeap() {
    const code = this.setCode();
    code.push('h = h + 1;');
  }

  getFromHeap(tmp: string, indice: string) {
    const code = this.setCode();
    code.push(`${tmp} = heap[(int)${indice}];`);
  }

  setToHeap(indice: string, tmp: string) {
    const code = this.setCode();
    code.push(`heap[(int)${indice}] = ${tmp};`);
  }

  // ---  Booleanos
  addTrueHeap() {
    this.setToHeap('h', String('t'.charCodeAt(0)));
    this.nextHeap();
    this.setToHeap('h', String('r'.charCodeAt(0)));
    this.nextHeap();
    this.setToHeap('h', String('u'.charCodeAt(0)));
    this.nextHeap();
    this.setToHeap('h', String('e'.charCodeAt(0)));
    this.nextHeap();
  }

  addFalseHeap() {
    this.setToHeap('h', String('f'.charCodeAt(0)));
    this.nextHeap();
    this.setToHeap('h', String('a'.charCodeAt(0)));
    this.nextHeap();
    this.setToHeap('h', String('l'.charCodeAt(0)));
    this.nextHeap();
    this.setToHeap('h', String('s'.charCodeAt(0)));
    this.nextHeap();
    this.setToHeap('h', String('e'.charCodeAt(0)));
    this.nextHeap();
  }


  // String nativa: dos parametos, dos concatenaciones.
  nativaPrintString() { 
    this.estado = codigo.FUNCION;
    const code = this.setCode();
    code.push("\n");
    this.addComment("--------- Print String Nativa --------------");
    code.push(`\nvoid _nativaPrintString(){`);
    let tmpParam1 = this.newTmp();
    this.addExpresion(tmpParam1, 'p', '+', '0');  
    let label = this.newLabel();
    let tmpH = this.newTmp();
    this.getFromStack(tmpH, tmpParam1);
    let labelNull = this.newLabel();
    this.addIf(tmpH, '-1', '==', labelNull);
    this.addLabel(label);
    let tmp = this.newTmp();
    this.getFromHeap(tmp, tmpH);
    let labelTrue = this.newLabel();
    let labelFalse = this.newLabel();
    this.addIf(tmp, '-1', '!=', labelTrue);
    this.addGoto(labelFalse);
    this.addLabel(labelTrue);
    code.push(`printf("%c", (int)${tmp});`);
    this.addExpresion(tmpH, tmpH, '+', 1);
    this.addGoto(label);
    this.addLabel(labelNull);
    code.push(`printf("null");`);
    this.addLabel(labelFalse);
    code.push(`return;`);
    code.push(`}`);
    this.addComment("--------- Fin Print String --------------");
    this.estado = codigo.CODE;
  }


  // POTENCIA
  nativaPotencia() { 
    this.estado = codigo.FUNCION;
    const code = this.setCode();
    code.push("\n");
    this.addComment("--------- Potencia Nativa --------------");
    code.push(`\nvoid _nativaPotencia(){`);
    let t1 = this.newTmp();
    this.addExpresion(t1, 'p', '+', '1');
    let t2 = this.newTmp();
    this.getFromStack(t2, t1);
    let t3 = this.newTmp();
    this.addExpresion(t3, 'p', '+', '2');
    let t4 = this.newTmp();
    this.getFromStack(t4, t3);
    let t5 = this.newTmp();
    this.addExpresion(t5, '0');
    let t6 = this.newTmp();
    this.addExpresion(t6, '1');
    let l0 = this.newLabel();
    this.addLabel(l0);
    let l1 = this.newLabel();
    let l2 = this.newLabel();
    this.addIf(t5, t4, '<', l1);
    this.addGoto(l2);
    this.addLabel(l1);
    this.addExpresion(t6, t6, '*', t2);
    this.addExpresion(t5, t5, '+', '1');
    this.addGoto(l0);
    this.addLabel(l2);
    let t7 = this.newTmp();
    this.addExpresion(t7, 'p');
    this.setToStack(t7, t6);
    code.push("return;");
    code.push("}");
    this.addComment("--------- Fin Potencia Nativa --------------");
    this.estado = codigo.CODE;
  }


  // ---------------------------- FUNCIONES -----------------------------

  newFuncion(callID: any, parametros: any) { 
    this.estado = codigo.FUNCION;
    const code = this.setCode();
    code.push("\n");
    this.addComment("--------- Declaracion Funcion --------------");

    code.push(`void ${callID}(){`);


  }


  finalizarFuncion() { 
    const code = this.setCode();
    code.push("}\n");
    this.addComment("--------- Fin Declaracion Funcion  --------------");
    this.estado = codigo.CODE;
  }








}
