import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Tipo } from "../../Utils/Tipo";
import { Error_ } from "../../Error/Error";
import { Instruccion } from "../../Abstractos/Instruccion";
import { Generador } from "src/Analizador/Generador/Generador";

export class AsignarAcceso extends Instruccion {

  constructor(private listaID: Array<any>, private valor: Expresion, line: number, column: number) {
    super(line, column);
  }

  public traducir(entorno: Entorno) {

    let valor = this.valor.traducir(entorno);
    let idPadre = this.listaID[0].id;
    let variable = entorno.getVariable(idPadre);
    const generador = Generador.getInstance();

    if (variable == null) {
      throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', "Variable no declarada: " + variable);
    }

    let tmp = generador.newTmp();
    let tmpS = generador.newTmp();
    generador.addExpresion(tmp, 'p', '+', variable.variable.getPosRelativa());
    generador.getFromStack(tmpS, tmp);

    if (this.listaID.length == 1) {
      let indice1 = this.listaID[0].indice.traducir(entorno);
      let tmpH = generador.newTmp();

      generador.addExpresion(tmpH, tmpS, '+', '2');
      generador.addExpresion(tmpH, tmpH, '+', indice1.getValor());
      generador.setToHeap(tmpH, valor.getValor());

    } else if (this.listaID.length == 2) {
      let indice1 = this.listaID[0].indice.traducir(entorno);
      let tmpH = generador.newTmp();

      generador.addExpresion(tmpH, tmpS, '+', '2');
      generador.addExpresion(tmpH, tmpH, '+', indice1.getValor());


      let indice2 = this.listaID[1].indice.traducir(entorno);
      let tmpH2 = generador.newTmp();
      generador.getFromHeap(tmpH2, tmpH);
      generador.addExpresion(tmpH2, tmpH2, '+', '2');
      generador.addExpresion(tmpH2, tmpH2, '+', indice2.getValor());
      generador.setToHeap(tmpH2, valor.getValor());

    } else if (this.listaID.length == 3) {
      let indice1 = this.listaID[0].indice.traducir(entorno);
      let tmpH = generador.newTmp();

      generador.addExpresion(tmpH, tmpS, '+', '2');
      generador.addExpresion(tmpH, tmpH, '+', indice1.getValor());

      let indice2 = this.listaID[1].indice.traducir(entorno);
      let tmpH2 = generador.newTmp();
      generador.getFromHeap(tmpH2, tmpH);
      generador.addExpresion(tmpH2, tmpH2, '+', '2');
      generador.addExpresion(tmpH2, tmpH2, '+', indice2.getValor());

      let indice3 = this.listaID[2].indice.traducir(entorno);
      let tmpH3 = generador.newTmp();
      generador.getFromHeap(tmpH3, tmpH2);
      generador.addExpresion(tmpH3, tmpH3, '+', '2');
      generador.addExpresion(tmpH3, tmpH3, '+', indice3.getValor());
      generador.setToHeap(tmpH3, valor.getValor());
    }
  }
}