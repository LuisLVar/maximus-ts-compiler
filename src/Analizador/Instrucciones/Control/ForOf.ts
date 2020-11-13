import { Instruccion } from "../../Abstractos/Instruccion";
import { Expresion } from "../../Abstractos/Expresion";
import { Entorno } from "../../Simbolo/Entorno";
import { Tipo } from "../../Utils/Tipo";
import { Error_ } from "../../Error/Error";
import { Generador } from "../../Generador/Generador";

export class ForOf extends Instruccion {

  constructor(private id: string, private declaracion: Instruccion | null, private Contenedor: Expresion,
    private cuerpo: Instruccion, linea: number, columna: number) {
    super(linea, columna);
  }

  public traducir(entorno: Entorno) {
    const nuevoEntorno = new Entorno(entorno);
    if (this.declaracion != null) {
      this.declaracion.traducir(nuevoEntorno);
    }
  }
}                                                                                              