import { Generador } from "src/Analizador/Generador/Generador";
import { Tipo, Type } from "src/Analizador/Utils/Tipo";
import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Retorno } from "../../Utils/Retorno";


export class valorArray extends Expresion {

  constructor(private values: Array<Expresion>, private size: Expresion | null, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno): Retorno {
    let retorno: Retorno;
    const generador = Generador.getInstance();
    if (this.size == null) {
      let tmp = generador.newTmp();
      generador.addExpresion(tmp, 'h');

      //Reservamos espacio para la dimension
      generador.setToHeap('h', '0');
      generador.nextHeap();

      //Reservamos espacio para el size
      generador.setToHeap('h', this.values.length+"");
      generador.nextHeap();

      //Reservamos espacio para la primera dimension
      for (let data of this.values) {
        generador.setToHeap('h', '0');
        generador.nextHeap();
      }

      generador.setToHeap('h', '-1');
      generador.nextHeap();

      //Seteamos los valores de las dimensiones.
      let tmpH = generador.newTmp();
      generador.addExpresion(tmpH, tmp, '+', '2');
      for (let data of this.values) {
        let expresion = data.traducir(entorno);
        generador.setToHeap(tmpH, expresion.getValor());
        generador.addExpresion(tmpH, tmpH, '+', '1');
      }

      retorno = new Retorno(tmp, true, new Type(Tipo.ARRAY, null, 0));
    } else {
      let size = this.size.traducir(entorno);
      let tmp = generador.newTmp();
      generador.addExpresion(tmp, 'h');

      //Reservamos espacio para la dimension
      generador.setToHeap('h', '1');
      generador.nextHeap();

      //Guardamos el size del array
      generador.setToHeap('h', size.getValor());
      generador.nextHeap();

      let labelLoop = generador.newLabel();
      let labelC = generador.newLabel();
      let labelE = generador.newLabel();
      let tmpContador = generador.newTmp();

      generador.addExpresion(tmpContador, '0');
      generador.addLabel(labelLoop);

      generador.addIf(tmpContador, size.getValor(), '<', labelC);
      generador.addGoto(labelE);

      generador.addLabel(labelC);
      generador.setToHeap('h', '0');
      generador.nextHeap();
      generador.addExpresion(tmpContador, tmpContador, '+', '1');

      generador.addGoto(labelLoop);
      generador.addLabel(labelE);

      //Cerramos espacio en heap
      generador.setToHeap('h', '-1');
      generador.nextHeap();

      retorno = new Retorno(tmp, true, new Type(Tipo.ARRAY, null, 0));
    }

    return retorno;
  }
}
