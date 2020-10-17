export class Generador {
  private static generador: Generador;
  private temporal: number;
  private label: number;
  private code: string[];

  private constructor() {
    this.temporal = this.label = 0;
    this.code = new Array();
  }

  public static getInstance() {
    return this.generador || (this.generador = new this());
  }
}
