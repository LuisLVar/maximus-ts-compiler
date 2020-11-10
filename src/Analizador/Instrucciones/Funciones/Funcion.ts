import { Instruccion } from "../../Abstractos/Instruccion";
import { Tipo } from "../../Utils/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Parametro } from "./Parametro";
import { Generador } from "src/Analizador/Generador/Generador";
import { Simbolo } from "src/Analizador/Simbolo/Simbolo";

export class Funcion extends Instruccion {

  constructor(private id: string, private cuerpo: Instruccion, public parametros: Array<Parametro>, private tipo: any,
    linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno) {
    //Guardamos funcion, validando que exista en su interior.
    // console.log(this);

    let params = "";
    for (let item of this.parametros) {
      params = params + '_' + Tipo[item.getTipo()];
    }

    const callID = `proc_${this.id}${params}`;
    entorno.guardarFuncion(this.id, this, callID, this.getLinea(), this.getColumna());

    //Guardar parametros
    const newEntorno = new Entorno(entorno);
    newEntorno.size = 0;
    // Reservamos espacio para el retorno en la posicion 0
    newEntorno.size++;
    // Reservamos espacio para el entorno global
    newEntorno.size++;
    this.parametros.forEach((param) => {
      if (param.getTipo() == Tipo.STRING || param.getTipo() == Tipo.ARRAY || param.getTipo() == Tipo.TYPE) {
        newEntorno.variables.set(param.getID(), new Simbolo(param.getID(), param.getType(), 1, newEntorno.size++, true, this.getLinea(), this.getColumna()));
      } else {
        newEntorno.variables.set(param.getID(), new Simbolo(param.getID(), param.getType(), 1, newEntorno.size++, false, this.getLinea(), this.getColumna()));
      }
    });

    //Generacion de codigo.
    const generador = Generador.getInstance();
    generador.newFuncion(callID, this.parametros);
    let labelRetorno = generador.newLabel();
    newEntorno.retorno = labelRetorno;
    newEntorno.esFuncion = true;
    this.cuerpo.traducir(newEntorno);
    generador.addLabel(labelRetorno);
    generador.codeFunciones.push("return;");

    generador.finalizarFuncion();


  }

  getCuerpo() {
    return this.cuerpo;
  }

  getTipo() {
    return this.tipo;
  }

  getID() {
    return this.id;
  }

  setTipo(tipo: any) {
    this.tipo = tipo;
  }


} 