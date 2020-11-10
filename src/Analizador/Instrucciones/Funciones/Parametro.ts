import { Tipo, Type } from "src/Analizador/Utils/Tipo";

export class Parametro { 

  tipoType: Type;
  constructor(private id: string, private tipo: any) { 
    if (tipo.dim > 0) {
      this.tipoType = new Type(Tipo.ARRAY, tipo.tipo, tipo.dim);
    } else { 
      this.tipoType = new Type(tipo.tipo, null, tipo.dim);
    }
    // onsole.log(this.tipoType);
    
  }

  getID() { 
    return this.id;
  }

  getTipo() { 
    return this.tipoType.getTipo();
  }

  getType() { 
    return this.tipoType;
  }
} 

