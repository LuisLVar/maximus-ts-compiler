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
    //       NUMBER       STRING       BOOLEAN     NULL       ARRAY        TYPE
    [//NUMBER
        Tipo.NUMBER, Tipo.STRING, Tipo.NUMBER, Tipo.NUMBER, Tipo.STRING, Tipo.STRING
    ],
    [//STRING
        Tipo.STRING, Tipo.STRING, Tipo.STRING, Tipo.STRING, Tipo.STRING, Tipo.STRING
    ],
    [//BOOLEAN
        Tipo.NUMBER, Tipo.STRING, Tipo.NUMBER, Tipo.NUMBER, Tipo.STRING, Tipo.STRING
    ],
    [ //NULL
        Tipo.NUMBER, Tipo.STRING, Tipo.NUMBER, Tipo.NUMBER, Tipo.STRING, Tipo.STRING
    ],
    [ //ARRAY
        Tipo.STRING, Tipo.STRING, Tipo.STRING, Tipo.STRING, Tipo.STRING, Tipo.STRING
    ],
    [ //TYPE
        Tipo.STRING, Tipo.STRING, Tipo.STRING, Tipo.STRING, Tipo.STRING, Tipo.STRING
    ]
];

export class Type{
    tipo : Tipo;
    typeName : string;
    struct : null;

    constructor(tipo: Tipo, typeName: string = '', struct : null = null){
        this.tipo = tipo;
        this.typeName = typeName;
        this.struct = struct;
    }

    getTipo() { 
        return this.tipo;
    }

}