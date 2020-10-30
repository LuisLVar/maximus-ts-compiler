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
  retornoLbl: string;

  constructor(valor: string, isTemp: boolean, tipo: Type, simbolo: Simbolo | null = null) {
    this.valor = valor; // Temporal o valor.
    this.isTemp = isTemp;
    this.tipo = tipo;
    this.simbolo = simbolo;
    this.trueLabel = this.falseLabel = this.retornoLbl = '';
  }

  getValor() {
    Generador.getInstance().liberarTmp(this.valor);
    return this.valor;
  }

  getValorCheck() {
    return this.valor;
  }

  getTipo() {
    return this.tipo.getTipo();
  }

  getType() {
    return this.tipo;
  }
}