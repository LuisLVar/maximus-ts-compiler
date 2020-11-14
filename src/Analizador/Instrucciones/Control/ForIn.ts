import { Instruccion } from "../../Abstractos/Instruccion";
import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Tipo } from "../../Utils/Tipo";
import { Error_ } from "../../Error/Error";
import { Generador } from "../../Generador/Generador";

export class ForIn extends Instruccion {

  constructor(private id: string, private declaracion: Instruccion | null, private Contenedor: Expresion,
    private cuerpo: Instruccion, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno) {
    const newEntorno = new Entorno(entorno);
    const generador = Generador.getInstance();

    const labelFor = generador.newLabel();
    const labelBreak = generador.newLabel();

    newEntorno.break = labelBreak;
    newEntorno.continue = labelFor;
    newEntorno.size = entorno.size;
    newEntorno.esFuncion = entorno.esFuncion;
    newEntorno.retorno = entorno.retorno;
    if (this.declaracion != null) {
      this.declaracion.traducir(newEntorno);
    }

    let elemento = newEntorno.getVariable(this.id);
    let contenedor = this.Contenedor.traducir(entorno);


    if (contenedor.getTipo() != Tipo.ARRAY && contenedor.getTipo() != Tipo.STRING) {
      throw new Error_(this.getLinea(), this.getColumna(), "Semántico",
        "Tipo incorrecto de contenedor: " + entorno.getTipoDato(contenedor.tipo) + ", se esperaba STRING o ARRAY.");
    }

    // ----------------------------------------------

    generador.addComment(' --------- Estructura de Control: ForIn ----------');

    let t1 = generador.newTmp();
    let t2 = generador.newTmp();
    let t3 = generador.newTmp();
    let tElemento = generador.newTmp();

    if (contenedor.getTipo() == Tipo.ARRAY) {
      generador.addExpresion(t1, contenedor.getValor(), '+', '2');
    } else { 
      generador.addExpresion(t1, contenedor.getValor());
    }

    generador.addExpresion(t2, '0');
    generador.addLabel(labelFor);
    
    generador.getFromHeap(t3, t1);
    generador.addIf(t3, '-1', '==', labelBreak);
    
    // Seteamos el valor del elemento
    generador.addExpresion(tElemento, 'p', '+', elemento.variable.getPosRelativa());
    generador.setToStack(tElemento, t2);
    
    //Traducimos Cuerpo
    this.cuerpo.traducir(newEntorno);

    generador.addExpresion(t1, t1, '+', '1');
    generador.addExpresion(t2, t2, '+', '1');
    generador.addGoto(labelFor);
    generador.addLabel(labelBreak);

    generador.addComment('------------ Fin ForIn -------------------');


  }
}                                                    