import { Instruccion } from "../../Abstractos/Instruccion";
import { Entorno } from "../../Simbolo/Entorno";
import { Error_ } from "../../Error/Error";
import { errores } from "../../Error/Errores";

export class Cuerpo extends Instruccion {

  constructor(private cuerpo: Array<Instruccion>, linea: number, columna: number) {
    super(linea, columna);
  }

  getCuerpo() { 
    return this.cuerpo;
  }

  public traducir(entorno: Entorno) {
    const newEntorno = new Entorno(entorno);
    newEntorno.break = entorno.break;
    newEntorno.continue = entorno.continue;
    newEntorno.size = entorno.size;
    for (const instruccion of this.cuerpo) {
      try {
        const retorno = instruccion.traducir(newEntorno);
        if (retorno != null || retorno != undefined) { 
          return retorno;
        }
      } catch (error) {
        console.log("Entro error");
        console.log(error);
        errores.push(error);
      }
    }
  }
}
