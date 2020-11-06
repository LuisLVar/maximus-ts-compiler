import { Instruccion } from "../../Abstractos/Instruccion";
import { Tipo } from "../../Utils/Tipo";
import { Entorno } from "../../Simbolo/Entorno";
import { Parametro } from "./Parametro";
import { Generador } from "src/Analizador/Generador/Generador";
import { Simbolo } from "src/Analizador/Simbolo/Simbolo";

export class Funcion extends Instruccion{

  constructor(private id: string, private cuerpo: Instruccion, public parametros: Array<Parametro>, private tipo: any,
    linea: number, columna: number) {
        super(linea, columna);
    }

    public traducir(entorno : Entorno) {
      //Guardamos funcion, validando que exista en su interior.

      let params = "";
      for (let item of this.parametros) {
        params = params + '_' + item.getTipo() + '_' +  item.getID(); 
      }

      const callID = `proc_${this.id}${params}`;
      entorno.guardarFuncion(this.id, this, callID, this.getLinea(), this.getColumna());

      //Guardar parametros
      const newEntorno = new Entorno(entorno);
      this.parametros.forEach((param) => {
        // Reservamos espacio para el retorno en la posicion 0
        newEntorno.size++;
        if (param.getTipo() == Tipo.STRING || param.getTipo() == Tipo.ARRAY || param.getTipo() == Tipo.TYPE) {
          newEntorno.variables.set(param.getID(), new Simbolo(param.getID(), param.getType(), 1, newEntorno.size++, true, this.getLinea(), this.getColumna()));
        } else { 
          newEntorno.variables.set(param.getID(), new Simbolo(param.getID(), param.getType(), 1, newEntorno.size++, false, this.getLinea(), this.getColumna()));
        }
        console.log(newEntorno.variables);
        
    });

      //Generacion de codigo.
      const generador = Generador.getInstance();
      generador.newFuncion(callID, this.parametros);
      this.cuerpo.traducir(newEntorno);
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