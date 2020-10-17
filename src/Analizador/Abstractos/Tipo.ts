import { Expresion } from "./Expresion";

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

export type Retorno = {
    value: any;
    tipo: Tipo;
    dim?: number;
}

export type AsignacionType = {
    id: string;
    id2: string;
    tipo: Tipo;
    indice?: Expresion;
}

export type AsignacionArray = {
    id: string;
    indice: Expresion;
    tipo: any;
    id2?: string;
}
