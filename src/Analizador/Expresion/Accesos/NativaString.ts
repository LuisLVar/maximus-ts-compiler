import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Tipo, Type } from "../../Utils/Tipo";
import { Error_ } from "../../Error/Error";
import { Retorno } from "../../Utils/Retorno";
import { Generador } from "src/Analizador/Generador/Generador";

export enum Nativa {
  CHARAT = 0,
  LOWER = 1,
  UPPER = 2,
  CONCAT = 3,
  LENGTH = 4
}

export class NativaString extends Expresion {

  constructor(private expresion: Expresion, private indice: any, private anterior: Expresion, private nativa: Nativa, line: number, column: number) {
    super(line, column);
  }

  public traducir(entorno: Entorno): Retorno {
    let retorno: Retorno;

    if (this.expresion != null) {

      const expresion = this.expresion.traducir(entorno);
      if (expresion.getTipo() != Tipo.STRING && expresion.getTipo() != Tipo.ARRAY) {
        throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'StringException: la expresion debe ser un String: ' + Tipo[expresion.getTipo()]);
      }

      const generador = Generador.getInstance();
      switch (this.nativa) {
        case Nativa.CHARAT: { 
          generador.addComment("----------------  String CharAt  -----------------");
          const indice = this.indice.traducir(entorno);
          let tmpRetorno = generador.newTmp();
          generador.addExpresion(tmpRetorno, 'h');
          let tmp = generador.newTmp();
          generador.addExpresion(tmp, expresion.getValor(), '+', indice.getValor());
          let tmpValorHeap = generador.newTmp();
          generador.getFromHeap(tmpValorHeap, tmp);
          generador.setToHeap('h', tmpValorHeap);
          generador.nextHeap();
          generador.setToHeap('h', '-1');
          generador.nextHeap();
          generador.addComment("----------------  Fin CharAt  -----------------");
          retorno = new Retorno(tmpRetorno, true, new Type(Tipo.STRING, null, 0));
          break;
        }
        case Nativa.LOWER: {

          generador.addComment("----------------  String ToLowerCase  -----------------");
          let tmpContador = generador.newTmp();
          generador.addExpresion(tmpContador, expresion.getValor());
          let tmpRetorno = generador.newTmp();
          generador.addExpresion(tmpRetorno, 'h');
          // Loop
          let labelLoop = generador.newLabel();
          generador.addLabel(labelLoop);
          //L1
          let tmpValorHeap = generador.newTmp();
          generador.getFromHeap(tmpValorHeap, tmpContador);
          let LSalida = generador.newLabel();
          let L2 = generador.newLabel();
          let L3 = generador.newLabel();
          let L4 = generador.newLabel();
          generador.addIf(tmpValorHeap, '-1', '==', LSalida);
          generador.addIf(tmpValorHeap, '65', '>=', L2);
          generador.addGoto(L3);
          generador.addLabel(L2);
          generador.addIf(tmpValorHeap, '90', '<=', L4);
          generador.addGoto(L3);
          // Es Mayuscula
          generador.addLabel(L4);
          let tmp = generador.newTmp();
          generador.addExpresion(tmp, tmpValorHeap, '+', '32');
          generador.setToHeap('h', tmp);
          generador.nextHeap();
          generador.addExpresion(tmpContador, tmpContador, '+', '1');
          generador.addGoto(labelLoop);
          // No es Mayuscula
          generador.addLabel(L3);
          generador.setToHeap('h', tmpValorHeap);
          generador.nextHeap();
          generador.addExpresion(tmpContador, tmpContador, '+', '1');
          generador.addGoto(labelLoop);

          generador.addLabel(LSalida);
          generador.setToHeap('h', '-1');
          generador.nextHeap();
          generador.addComment("----------------  Fin ToLowerCase  -----------------");
          retorno = new Retorno(tmpRetorno, true, new Type(Tipo.STRING, null, 0));

          break;
        }
        case Nativa.UPPER: {
          generador.addComment("----------------  String ToUpperCase  -----------------");
          let tmpContador = generador.newTmp();
          generador.addExpresion(tmpContador, expresion.getValor());
          let tmpRetorno = generador.newTmp();
          generador.addExpresion(tmpRetorno, 'h');
          // Loop
          let labelLoop = generador.newLabel();
          generador.addLabel(labelLoop);
          //L1
          let tmpValorHeap = generador.newTmp();
          generador.getFromHeap(tmpValorHeap, tmpContador);
          let LSalida = generador.newLabel();
          let L2 = generador.newLabel();
          let L3 = generador.newLabel();
          let L4 = generador.newLabel();
          generador.addIf(tmpValorHeap, '-1', '==', LSalida);
          generador.addIf(tmpValorHeap, '97', '>=', L2);
          generador.addGoto(L3);
          generador.addLabel(L2);
          generador.addIf(tmpValorHeap, '122', '<=', L4);
          generador.addGoto(L3);
          // Es Mayuscula
          generador.addLabel(L4);
          let tmp = generador.newTmp();
          generador.addExpresion(tmp, tmpValorHeap, '-', '32');
          generador.setToHeap('h', tmp);
          generador.nextHeap();
          generador.addExpresion(tmpContador, tmpContador, '+', '1');
          generador.addGoto(labelLoop);
          // No es Mayuscula
          generador.addLabel(L3);
          generador.setToHeap('h', tmpValorHeap);
          generador.nextHeap();
          generador.addExpresion(tmpContador, tmpContador, '+', '1');
          generador.addGoto(labelLoop);

          generador.addLabel(LSalida);
          generador.setToHeap('h', '-1');
          generador.nextHeap();
          generador.addComment("----------------  Fin ToUpperCase  -----------------");
          retorno = new Retorno(tmpRetorno, true, new Type(Tipo.STRING, null, 0));

          break;
        }
        case Nativa.CONCAT: {

          generador.addComment("------------  Inicio CONCAT ------------");
          const leftValue = this.expresion.traducir(entorno);
          const rightValue = this.indice.traducir(entorno);

          if (rightValue.getTipo() == Tipo.STRING) {
            // Temporal del retorno
            let tmp = generador.newTmp();
            generador.addExpresion(tmp, 'h');

            //String derecho
            let label = generador.newLabel();
            let tmpH = generador.newTmp();
            let tmpRes = generador.newTmp();
            generador.addExpresion(tmpH, leftValue.getValor());
            generador.addLabel(label);

            let labelTrue = generador.newLabel();
            let labelFalse = generador.newLabel();
            generador.getFromHeap(tmpRes, tmpH);
            generador.addIf(tmpRes, '-1', '!=', labelTrue);
            generador.addGoto(labelFalse);
            generador.addLabel(labelTrue);
            generador.setToHeap('h', tmpRes);
            generador.addExpresion(tmpH, tmpH, '+', 1);
            generador.nextHeap();
            generador.addGoto(label);
            generador.addLabel(labelFalse);

            // String Izquierdo
            label = generador.newLabel();
            tmpH = generador.newTmp();
            tmpRes = generador.newTmp();
            generador.addExpresion(tmpH, rightValue.getValor());
            generador.addLabel(label);

            labelTrue = generador.newLabel();
            labelFalse = generador.newLabel();
            generador.getFromHeap(tmpRes, tmpH);
            generador.addIf(tmpRes, '-1', '!=', labelTrue);
            generador.addGoto(labelFalse);
            generador.addLabel(labelTrue);
            generador.setToHeap('h', tmpRes);
            generador.addExpresion(tmpH, tmpH, '+', 1);
            generador.nextHeap();
            generador.addGoto(label);
            generador.addLabel(labelFalse);
            // Fin de concatenacion
            generador.setToHeap('h', '-1');
            generador.nextHeap();
            generador.addComment("------------  Fin CONCAT ------------");
            retorno = new Retorno(tmp, true, new Type(Tipo.STRING, null, 0));

          } else {
            throw new Error_(this.getLinea(), this.getColumna(), 'Semántico', 'StringException: la expresion debe ser un String: ' + Tipo[rightValue.getTipo()]);
          }
          break;
        }
        case Nativa.LENGTH: {
          let cadena: string = this.indice;
          if (cadena.toLowerCase() == "length") {
            if (expresion.getTipo() == Tipo.ARRAY) { 

              let tmpS = generador.newTmp();
              let tmpH = generador.newTmp();

              generador.addExpresion(tmpS, expresion.getValor(), '+', '1');
              generador.getFromHeap(tmpH, tmpS);

              retorno = new Retorno(tmpH, true, new Type(Tipo.NUMBER, null, 0));

            } else{ 
              generador.addComment("------------  Inicio LENGTH ------------");
              let expresion = this.expresion.traducir(entorno);
  
              let label = generador.newLabel();
              let tmpH = generador.newTmp();
              let tmpRes = generador.newTmp();
              let tmpContador = generador.newTmp();
              generador.addExpresion(tmpContador, 0);
              generador.addExpresion(tmpH, expresion.getValor());
              generador.addLabel(label);
  
              let labelTrue = generador.newLabel();
              let labelFalse = generador.newLabel();
              generador.getFromHeap(tmpRes, tmpH);
              generador.addIf(tmpRes, '-1', '!=', labelTrue);
              generador.addGoto(labelFalse);
              generador.addLabel(labelTrue);
              generador.addExpresion(tmpContador, tmpContador, '+', 1);
              generador.addExpresion(tmpH, tmpH, '+', 1);
              generador.addGoto(label);
              generador.addLabel(labelFalse);
              generador.addComment("------------  Fin LENGTH ------------");
              retorno = new Retorno(tmpContador, true, new Type(Tipo.NUMBER, null, 0));
            }
          } else {
            console.log("Solo se valida el length.");
          }
          break;
        }

      }
    }





    return retorno;


  }

}