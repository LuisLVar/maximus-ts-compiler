export class Parametro { 
  constructor(private id: string, private tipo: any) { 
    
  }

  getID() { 
    return this.id;
  }

  getTipo() { 
    return this.tipo;
  }
} 

