import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";
import { Expresion } from "../../Abstractos/Expresion";
import { Tipo, Type } from "../../Utils/Tipo";
import { Retorno } from "../../Utils/Retorno";
import { Error_ } from "../../Error/Error";
import { Generador } from '../../Generador/Generador';

export class If extends Instruccion {

  constructor(private condicion: Expresion, private cuerpoIf: Instruccion,
    private cuerpoElse: Instruccion | null, linea: number, columna: number) {
    super(linea, columna);
  }

  traducir(entorno: Entorno): void {
    const generador = Generador.getInstance();
    generador.addComment('----------- Estructura de Control: If -------------');
    const condicion = this.condicion?.traducir(entorno);
    const newEntorno = new Entorno(entorno);
    newEntorno.break = entorno.break;
    newEntorno.continue = entorno.continue;
    newEntorno.size = entorno.size;
    if (condicion.getTipo() == Tipo.BOOLEAN) {
      generador.addLabel(condicion.trueLabel);
      this.cuerpoIf.traducir(newEntorno);
      if (this.cuerpoElse != null) {
        generador.addComment('----------- Estructura de Control: Else -------------');
        const label = generador.newLabel();
        generador.addGoto(label);
        generador.addLabel(condicion.falseLabel);
        this.cuerpoElse.traducir(entorno);
        generador.addLabel(label);
      }
      else {
        generador.addLabel(condicion.falseLabel);
      }
      generador.addComment('----------- Fin If -------------');
      return;
    }
    throw new Error_(this.getLinea(), this.getColumna(), 'Semantico', `Error If: La condicion no es booleana -> ${Tipo[condicion?.getTipo()]}`);
  }
}