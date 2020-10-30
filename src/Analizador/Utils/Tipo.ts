import { Expresion } from "../Abstractos/Expresion";

export enum Tipo {
    NUMBER = 0,
    STRING = 1,
    BOOLEAN = 2,
    NULL = 3,
    ARRAY = 4,
    TYPE = 5,
    VOID = 6,
    BREAK = 7,
    CONTINUE = 8,
    UNDEFINED = 9,
    RETURN = 10,
    ANY = 11
}

export const tipoDominante = [
    //       NUMBER       STRING       BOOLEAN 
    [//NUMBER
        Tipo.NUMBER, Tipo.STRING, Tipo.NUMBER
    ],
    [//STRING
        Tipo.STRING, Tipo.STRING, Tipo.STRING
    ],
    [//BOOLEAN
        Tipo.NUMBER, Tipo.STRING, Tipo.UNDEFINED
    ]
];

export class Type{
    tipo : Tipo;
    typeName : string;
    struct: null;
    dim: any;
    tipoArray: Tipo | null;

    constructor(tipo: Tipo, tipoArray : Tipo,  dim : any, typeName: string = '', struct : null = null){
        this.tipo = tipo;
        this.typeName = typeName;
        this.struct = struct;
        this.dim = dim;
        this.tipoArray = tipoArray;
    }

    getTipo() { 
        return this.tipo;
    }

}