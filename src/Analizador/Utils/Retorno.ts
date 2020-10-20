import { Simbolo } from "../Simbolo/Simbolo";
import { Tipo, Type } from "./Tipo";
import { Generador } from "../Generador/Generador";

export class Retorno {
  valor: any;
  isTemp: boolean;
  tipo: Type;
  trueLabel: string;
  falseLabel: string;
  simbolo: Simbolo | null;

  constructor(valor: string, isTemp: boolean, tipo: Type, simbolo: Simbolo | null = null) {
    this.valor = valor;
    this.isTemp = isTemp;
    this.tipo = tipo;
    this.simbolo = simbolo;
    this.trueLabel = this.falseLabel = '';
  }

  getValor() {
    Generador.getInstance().liberarTmp(this.valor);
    return this.valor;
  }

  getTipo() {
    return this.tipo.getTipo();
  }

  getType() {
    return this.tipo;
  }
}