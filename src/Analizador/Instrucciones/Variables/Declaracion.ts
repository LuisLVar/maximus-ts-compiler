import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";
import { Expresion } from "../../Abstractos/Expresion";
import { Tipo } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";
import { Error_ } from "../../Error/Error";


export enum tipoDeclaracion {
  LET = 1,
  CONST = 2
}


export class Declaracion extends Instruccion {

  private id: string;
  private valor: Expresion;
  private tipo: any;
  private tipoVariable: tipoDeclaracion;

  constructor(id: string, tipo: any, valor: Expresion, tipoVariable: tipoDeclaracion, linea: number, columna: number) {
    super(linea, columna);
    this.id = id;
    this.valor = valor;
    this.tipo = tipo;
    this.tipoVariable = tipoVariable;
  }

  public traducir(entorno: Entorno) {

  }
}