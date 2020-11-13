%{
    const {errores} = require ('../Error/Errores');
    const {Error_} = require('../Error/Error');
    const {Nodo} = require('./Nodo');
    const {Tipo, tipoDominante} = require('../Utils/Tipo');
    //Instrucciones
    //nodo
    let node;
    let nodo;
    let node2;
    let nodoi8;
    let codigo;
    let tipo;
    let nodoLista;
    let valorLista;
%}

%lex

entero  [0-9]+
number {entero}("."{entero})?
string  ((\"[^"]*\")|(\'[^']*\')|(\`[^`]*\`))
id ([a-zA-Z_])[a-zA-Z0-9_ñÑ]*
boolean ("true"|"false")

%%
\s+                   /* Se ignoran espacios en blanco */
"//".*										// comentario una línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiples líneas

// Tipos
{number}                return 'NUMBER';
{string}                return 'STRING';
{boolean}               return 'BOOLEAN';
"null"                  return 'NULL';

//TIPOS DE DATOS
"number"                return 'TNUMBER'
"boolean"               return 'TBOOLEAN'
"string"                return 'TSTRING'
"void"                  return 'TVOID'
"type"                  return 'TTYPE'
"push"                  return 'PUSH'
"pop"                  return 'POP'


//Variables
"let"                   return "LET";
"const"                 return "CONST";


//Instrucciones
"console.log"           return 'CONSOLELOG';
"if"                    return 'TIF'
"else"                  return 'TELSE'
"while"                 return 'TWHILE'
"do"                    return 'TDO'
"break"                 return 'BREAK'
"continue"              return 'CONTINUE'
"graficar_ts"           return 'GRAFICARTS'
"for"                   return 'TFOR'
"switch"                return 'TSWITCH'
"case"                  return 'TCASE'
"default"               return 'TDEFAULT'
"function"              return 'TFUNCTION'
"return"                return 'TRETURN'
"type"                  return 'TTYPE'
"of"                    return 'OF'
"in"                    return 'IN'

// "\n\r"                    return "SALTO";

//Operaciones

"++"				    return 'INC';
"--"				    return 'DEC';

"+"                     return 'MAS';
"-"                     return 'MENOS';
"**"                    return 'POT';
"*"                     return 'POR';
"/"                     return 'DIV';
"%"				        return 'MOD';

// Relacionales
"<="                    return 'MENORIGUAL';
">="                    return 'MAYORIGUAL';
"<"                     return 'MENORQUE';
">"                     return 'MAYORQUE';
"=="                    return 'IGUALIGUAL';
"!="                    return 'DESIGUAL';
"="                     return 'IGUAL';

// Logicas
"||"                    return 'OR';
"&&"                    return 'AND';
"!"                     return 'NOT';

//Agrupacion
"("                     return 'PARIZQ';
")"                     return 'PARDER';
"{"                     return 'LLAVEIZQ';
"}"                     return 'LLAVEDER';
"["					    return 'CORIZQ';		
"]"					    return 'CORDER';

";"                     return 'PUNTOYCOMA';
","                     return 'COMA';
":"                     return 'DOSPUNTOS';
"?"                     return 'INTER';
"."                     return 'PUNTO';

"`"                     return 'CINVERTIDA'  
"$"                     return 'DOLAR'   
"\\"                     return 'DINVERT'     


{id}	                return 'ID';

<<EOF>>		            return 'EOF';
.					    {  }

/lex

%right 'IGUAL'
%right 'INC' 'DEC'
%left 'OR'
%left 'AND'
%left 'INTER' 'PUNTOYCOMA'
%left 'IGUALIGUAL', 'DESIGUAL'
%left 'MAYORIGUAL', 'MENORIGUAL', 'MENORQUE', 'MAYORQUE'
%left 'MAS' 'MENOS'
%left 'POR' 'DIV' 'MOD'
%right 'POT' 
%right 'NOT' 'UMAS' 'UMENOS'
%left 'PARIZQ' 'PARDER' 'CORIZQ' 'CORDER'

%start Init

%%

Init    
    : Instrucciones EOF
    {
        let nodoi0 = new Nodo("Instrucciones");
        codigo = "";
        for(let a of $1){
            nodoi0.newHijo(a.nodo);
            codigo = codigo + a.code + "\n";
        }
        let valor = { code: codigo, nodo: nodoi0};
        return valor;
    }
;

InstruccionesCuerpo
    :   Instrucciones {
        nodo = new Nodo("Instrucciones");
        codigo = "";
        for(let a of $1){
            nodo.newHijo(a.nodo);
            codigo = codigo + a.code + "\n";
        }
        valorLista = { code: codigo, nodo: nodo };
        $$ = valorLista;
    }
;

InstruccionesFCuerpo
    :   InstruccionesF {
        nodo = new Nodo("InstruccionesF");
        codigo = "";
        for(let a of $1){
            nodo.newHijo(a.nodo);
            codigo = codigo + a.code + "\n";
        }
        valorLista = { code: codigo, nodo: nodo };
        $$ = valorLista;
    }
;

Instrucciones
    : Instrucciones Instruccion
    {
        $1.push($2);
        $$ = $1;
    }
    | Instruccion{
        $$ = [$1];
    }
;

InstruccionesF
    : InstruccionesF InstruccionF
    {
        $1.push($2);
        $$ = $1;
    }
    | InstruccionF{
        $$ = [$1];
    }
;

Instruccion
    : Imprimir 
    {
        let nodoi1 = new Nodo("Instruccion");
        nodoi1.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi1 };
    }
    | GraficarTS 
    {
        let nodoi2 = new Nodo("Instruccion");
        nodoi2.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi2 };
    }
    | Declaracion
    {
        let nodoi3 = new Nodo("Instruccion");
        nodoi3.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi3 };
    }
    | Asignacion
    {
        let nodoi4 = new Nodo("Instruccion");
        nodoi4.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi4 };
    }
    | NTIf
    {
        let nodoi5 = new Nodo("Instruccion");
        nodoi5.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi5 };
    }
    | Cuerpo
    {
        let nodoi6 = new Nodo("Instruccion");
        nodoi6.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi6 };
    }
    | NTWhile
    {
        let nodoi7 = new Nodo("Instruccion");
        nodoi7.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi7 };
    }
    | NTDoWhile
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTFor
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTForIn
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTForOf
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTSwitch
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTFuncion
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTCall PUNTOYCOMA
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code+$2, nodo: nodoi8 };
    }
    | NTType
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | BREAK PUNTOYCOMA
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo(new Nodo($1));
        $$ = { code: $1+$2, nodo: nodoi8 };
    }
    | CONTINUE PUNTOYCOMA
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo(new Nodo($1));
        $$ = { code: $1+$2, nodo: nodoi8 };
    }
    | NTReturn PUNTOYCOMA
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code+$2, nodo: nodoi8 };
    }
    | error Recuperar
    { 
        //errores.push(new Error_(@1.first_line, @1.first_column, "Sintáctico", "Se esperaba: "+ yytext));
    }
;

InstruccionF
    : Imprimir 
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | GraficarTS 
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | Declaracion
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | Asignacion
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTIf
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | Cuerpo
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTWhile
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTDoWhile
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTFor
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTForIn
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTForOf
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTSwitch
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code, nodo: nodoi8 };
    }
    | NTCall PUNTOYCOMA
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code+$2, nodo: nodoi8 };
    }
    | NTReturn PUNTOYCOMA
    {
        nodoi8 = new Nodo("Instruccion");
        nodoi8.newHijo($1.nodo);
        $$ = { code: $1.code+$2, nodo: nodoi8 };
    }
    | error Recuperar
    { 
        //errores.push(new Error_(@1.first_line, @1.first_column, "Sintáctico", "Se esperaba: "+ yytext));
    }
;


Imprimir
    : CONSOLELOG PARIZQ ListaExp PARDER PUNTOYCOMA 
    {
        node = new Nodo("Imprimir");
        node.newHijo(new Nodo($1));
        nodoLista = new Nodo("ListaExpresion");
        codigo = "";
        for(let a of $3){
            nodoLista.newHijo(a.nodo);
            codigo = codigo + a.code+", ";
        }
        codigo = codigo.slice(0, -2);
        valorLista = { code: codigo, nodo: nodoLista };
        node.newHijo(valorLista.nodo);

        $$ = { code: $1+$2+valorLista.code+$4+$5, nodo: node };
    }
;

GraficarTS
    : GRAFICARTS PARIZQ PARDER PUNTOYCOMA 
    {
        node = new Nodo("GraficarTS");
        node.newHijo(new Nodo($1));
        $$ = { code: $1+$2+$3+$4, nodo: node };
    }
;

Declaracion
    : LET ID DOSPUNTOS Tipo Dimensiones IGUAL Expresion PUNTOYCOMA // Para Arrays
    {
        node = new Nodo("Declaracion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));
        node.newHijo($4.nodo);
        tipo = $4.tipo;
        if($5.tipo != Tipo.NULL){
            node.newHijo($5.nodo);
            tipo = $5.tipo;
        }
        node.newHijo(new Nodo($6));
        node.newHijo($7.nodo);

        $$ = { code: "let "+$2+$3+$4.code+$5.code+$6+$7.code+$8, nodo: node, tipo: tipo };
    }
    | LET ID DOSPUNTOS Tipo Dimensiones PUNTOYCOMA // Para arrays
    {
        node = new Nodo("Declaracion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));
        node.newHijo($4.nodo);
        tipo = $4.tipo;
        if($5.tipo != Tipo.NULL){
            node.newHijo($5.nodo);
            tipo = $5.tipo;
        }
        $$ = { code: "let "+$2+$3+$4.code+$5.code+$6, nodo: node, tipo: tipo };
    }
    | LET ID IGUAL Expresion PUNTOYCOMA
    {
        node = new Nodo("Declaracion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));
        node.newHijo(new Nodo($3));
        node.newHijo($4.nodo);

        $$ = { code: "let "+$2+$3+$4.code+$5, nodo: node, tipo: $4.tipo };
    }
    | LET ID PUNTOYCOMA
    {
        node = new Nodo("Declaracion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));

        $$ = { code: "let "+$2+$3, nodo: node, tipo: Tipo.NULL };
    }
    | CONST ID DOSPUNTOS Tipo Dimensiones IGUAL Expresion PUNTOYCOMA
    {
        node = new Nodo("Declaracion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));
        node.newHijo($4.nodo);
        tipo = $4.tipo;
        if($5.tipo != Tipo.NULL){
            node.newHijo($5.nodo);
            tipo = $5.tipo;
        }
        node.newHijo(new Nodo($6));
        node.newHijo($7.nodo);
        $$ = { code: "const "+$2+$3+$4.code+$5.code+$6+$7.code+$8, nodo: node, tipo: tipo };
    }
    | CONST ID IGUAL Expresion PUNTOYCOMA
    {
        let nodoConst = new Nodo("Declaracion");
        nodoConst.newHijo(new Nodo($1));
        nodoConst.newHijo(new Nodo($2));
        nodoConst.newHijo(new Nodo($3));
        nodoConst.newHijo($4.nodo);
        $$ = { code: "const "+$2+$3+$4.code+$5, nodo: nodoConst, tipo: $4.tipo };
    }
    | CONST ID DOSPUNTOS Tipo Dimensiones PUNTOYCOMA
    {
        node = new Nodo("Declaracion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));
        node.newHijo($4.nodo);
        tipo = $4.tipo;
        if($5.tipo != Tipo.NULL){
            node.newHijo($5.nodo);
            tipo = $5.tipo;
        }
        $$ = { code: "const "+$2+$3+$4.code+$5.code+$6, nodo: node, tipo: tipo };
    }
    | CONST ID PUNTOYCOMA
    {
        node = new Nodo("Declaracion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));
        $$ = { code: "const "+$2+$3, nodo: node, tipo: Tipo.NULL };
    }
;


Asignacion
    : ID IGUAL Expresion PUNTOYCOMA
    {
        node = new Nodo("Asignacion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));
        node.newHijo($3.nodo);

        $$ = { code: $1+$2+$3.code+$4, nodo: node, tipo: $3.tipo };
    }
    | ID INC PUNTOYCOMA
    {
        node = new Nodo("Asignacion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));

        $$ = { code: $1+$2+$3, nodo: node, tipo: Tipo.NUMBER };
    }
    | ID DEC PUNTOYCOMA
    {
        node = new Nodo("Asignacion");
        node.newHijo(new Nodo($1));
        node.newHijo(new Nodo($2));

        $$ = { code: $1+$2+$3, nodo: node, tipo: Tipo.NUMBER };
    }
    | AccesosA IGUAL Expresion PUNTOYCOMA
    {
        node2 = new Nodo("AccesosA");
        tipo = $1[0].tipo;
        codigo = "";
        for(let a of $1){
            node2.newHijo(a.nodo);
            codigo = codigo+a.code;
        }

        node = new Nodo("Asignacion");
        node.newHijo(node2);
        node.newHijo(new Nodo($2));
        node.newHijo($3.nodo);

        $$ = { code: codigo+$2+$3.code+$4, nodo: node, tipo: tipo };
    }
;

AccesosA 
    : AccesosA PUNTO ID
    {
        nodo = new Nodo("AccesoType");
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        $1.push({code: $2+$3, nodo: nodo, tipo: 5});
        $$ = $1;
    }
    | AccesosA CORIZQ Expresion CORDER
    {
        nodo = new Nodo("AccesoArray");
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo(new Nodo($4));
        $1.push({code: $2+$3.code+$4, nodo: nodo, tipo: 4});
        $$ = $1;
    }
    | AccesoA
    {
        $$ = [$1];
    }
;


AccesoA
    : ID PUNTO ID
    {
        nodo = new Nodo("AccesoType");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        $$ = {code: $1+$2+$3, nodo: nodo, tipo: 5};
    }
    | ID CORIZQ Expresion CORDER
    {
        nodo = new Nodo("AccesoArray");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo(new Nodo($4));
        $$ = {code: $1+$2+$3.code+$4, nodo:nodo, tipo: 4};
    }
;


NTIf
    : TIF PARIZQ Expresion PARDER Cuerpo NTElse
    {
        nodo = new Nodo("If");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo(new Nodo($4));
        nodo.newHijo($5.nodo);
        if($6.nodo != null){
            nodo.newHijo($6.nodo);
        }
        $$ = {code: $1+$2+$3.code+$4+$5.code+$6.code, nodo:nodo};
    }
;

NTElse
    : TELSE Cuerpo {
        nodo = new Nodo("Else");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo($2.nodo);

        $$ = {code: $1+$2.code, nodo:nodo};
    }
    | TELSE NTIf {
        nodo = new Nodo("Else If");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo($2.nodo);

        $$ = {code: $1+" "+$2.code, nodo:nodo};
    }
    | /* Epsilon */
    {
        $$ = {code: "", nodo:null};
    }
;

NTWhile
    : TWHILE PARIZQ Expresion PARDER Cuerpo
    {
        nodo = new Nodo("While");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo(new Nodo($4));
        nodo.newHijo($5.nodo);
        $$ = {code: $1+$2+$3.code+$4+$5.code, nodo:nodo};
    }
;

NTDoWhile
    : TDO Cuerpo TWHILE PARIZQ Expresion PARDER PUNTOYCOMA
    {
        nodo = new Nodo("Do While");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo($2.nodo);
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        nodo.newHijo($5.nodo);
        nodo.newHijo(new Nodo($6));
        $$ = {code: $1+$2.code+$3+$4+$5.code+$6+$7, nodo:nodo};
    }
;

Cuerpo
    : LLAVEIZQ InstruccionesCuerpo LLAVEDER
    {
        nodo = new Nodo("Cuerpo");
        nodo.newHijo($2.nodo);

        $$ = {code: $1+"\n\t"+$2.code+$3, nodo:nodo};
    }
    | LLAVEIZQ LLAVEDER
    {
        nodo = new Nodo("Cuerpo");
        $$ = {code: $1+$2, nodo:nodo};
    }
;

CuerpoFuncion
    : LLAVEIZQ InstruccionesFCuerpo LLAVEDER
    {
        nodo = new Nodo("Cuerpo Funcion");
        nodo.newHijo($2.nodo);

        $$ = {code: $1+"\n\t"+$2.code+$3, nodo:nodo};
    }
    | LLAVEIZQ LLAVEDER
    {
        nodo = new Nodo("Cuerpo Funcion");
        $$ = {code: $1+$2, nodo:nodo};
    }
;

NTFor
    : TFOR PARIZQ AorD  Expresion PUNTOYCOMA AsignacionFor PARDER Cuerpo
    {
        nodo = new Nodo("For");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo($4.nodo);
        nodo.newHijo(new Nodo($5));
        nodo.newHijo($6.nodo);
        nodo.newHijo(new Nodo($7));
        nodo.newHijo($8.nodo);
        $$ = {code: $1+$2+$3.code+" "+$4.code +" "+$5+ $6.code +$7+$8.code, nodo:nodo};
    }
;

NTForIn
    : TFOR PARIZQ ID IN Expresion PARDER Cuerpo
    {
        nodo = new Nodo("ForIn");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        nodo.newHijo($5.nodo);
        nodo.newHijo(new Nodo($6));
        nodo.newHijo($7.nodo);
        $$ = {code: $1+$2+$3+" "+$4+" "+$5.code+" "+$6+$7.code, nodo:nodo};
    }
    | TFOR PARIZQ LET ID IN Expresion PARDER Cuerpo
    {
        nodo = new Nodo("ForIn");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        nodo.newHijo(new Nodo($5));
        nodo.newHijo($6.nodo);
        nodo.newHijo(new Nodo($7));
        nodo.newHijo($8.nodo);
        $$ = {code: $1+$2+$3+" "+$4+" "+$5+" "+$6.code+$7+$8.code, nodo:nodo};
    }
;

NTForOf
    : TFOR PARIZQ ID OF Expresion PARDER Cuerpo
    {
        nodo = new Nodo("ForOf");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        nodo.newHijo($5.nodo);
        nodo.newHijo(new Nodo($6));
        nodo.newHijo($7.nodo);
        $$ = {code: $1+$2+$3+" "+$4+" "+$5.code+$6+$7.code, nodo:nodo};
    }
    | TFOR PARIZQ LET ID OF Expresion PARDER Cuerpo
    {
        nodo = new Nodo("ForOf");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        nodo.newHijo(new Nodo($5));
        nodo.newHijo($6.nodo);
        nodo.newHijo(new Nodo($7));
        nodo.newHijo($8.nodo);
        $$ = {code: $1+$2+$3+" "+$4+" "+$5+" "+$6.code+$7+$8.code, nodo:nodo};
    }
;


AsignacionFor
    : ID IGUAL Expresion
    {
        nodo = new Nodo("AsignacionFor");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        $$ = {code: $1+$2+$3.code, nodo:nodo};
    }
    | ID INC
    {
        nodo = new Nodo("AsignacionFor");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        $$ = {code: $1+$2, nodo:nodo};
    }
    | ID DEC
    {
        nodo = new Nodo("AsignacionFor");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        $$ = {code: $1+$2, nodo:nodo};
    }
;

AorD
    : Declaracion
    | Asignacion
;

NTSwitch
    : TSWITCH PARIZQ Expresion PARDER LLAVEIZQ Cases LLAVEDER
    {
        nodo = new Nodo("Switch");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo(new Nodo($4));

        node = new Nodo("Cases");
        codigo = "";
        for(let a of $6){
            node.newHijo(a.nodo);
            codigo = codigo + a.code + "\n";
        }
        nodo.newHijo(node);

        $$ = {code: $1+$2+$3.code+$4+$5+"\n\t"+codigo+$7, nodo:nodo};
    }
;

Cases
    :  Cases Caso
    {
        $1.push($2);
        $$ = $1;
    }
    | Caso 
    {
        $$ = [$1];
    }
;

Caso
    : TCASE Expresion DOSPUNTOS Case2
    {
        nodo = new Nodo("Caso");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo($2.nodo);
        nodo.newHijo(new Nodo($3));
        if($4.nodo != null){
            nodo.newHijo($4.nodo);
        }
        $$ = {code: $1+" "+$2.code+$3+"\n\t"+$4.code, nodo:nodo};
    }
    | TDEFAULT DOSPUNTOS Case2
    {
        nodo = new Nodo("Default");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        if($3.nodo != null){
            nodo.newHijo($3.nodo);
        }
        $$ = {code: $1+" "+$2+"\n\t"+$3.code, nodo:nodo};
    }
;

Case2
    : InstruccionesCuerpo {
        $$ = $1;
    }
    | /* Epsilon */
    {
        $$ = {nodo: null, code: ""};
    }
;


NTFuncion
    : TFUNCTION ID PARIZQ PARDER TipoFuncion CuerpoFuncion  
    {
        nodo = new Nodo("Funcion");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        if($5.nodo != null){
            nodo.newHijo($5.nodo);
        }
        nodo.newHijo($6.nodo);
        $$ = {code: $1+" "+$2+$3+$4 + $5.code + $6.code , nodo:nodo, tipo: $5.tipo};
    }
    | TFUNCTION ID PARIZQ Parametros PARDER TipoFuncion CuerpoFuncion 
    {
        nodo = new Nodo("Funcion");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        
        //Parametros
        node = new Nodo("Parametros");
        codigo = "";
        for(let a of $4){
            node.newHijo(a.nodo);
            codigo = codigo + a.code + ", ";
        }
        nodo.newHijo(node);
        codigo = codigo.slice(0, -2);

        nodo.newHijo(new Nodo($5));
        if($6.nodo != null){
            nodo.newHijo($6.nodo);
        }
        nodo.newHijo($7.nodo);
        $$ = {code: $1+" "+$2+$3+codigo + $5 + $6.code +$7.code, nodo:nodo, tipo: $6.tipo};
    }
;

TipoFuncion
    : DOSPUNTOS Tipo
    {
        nodo = new Nodo("TipoFuncion");
        nodo.newHijo($2.nodo);
        $$ = {code: $1+$2.code, nodo: nodo, tipo: $2.tipo};
    }
    | /*epsilon*/
    {
        $$ = {code: "", nodo: null, tipo:Tipo.ANY};
    }
;

NTCall
    : ID PARIZQ PARDER
    {
        nodo = new Nodo("Call Funcion");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        $$ = {code: $1+$2+$3, nodo: nodo, tipo: Tipo.NULL};
    }
    | ID PARIZQ ListaExp PARDER
    {
        nodo = new Nodo("Call Funcion");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        //Lista Expresion
        nodoLista = new Nodo("ListaExpresion");
        codigo = "";
        for(let a of $3){
            nodoLista.newHijo(a.nodo);
            codigo = codigo + a.code+", ";
        }
        codigo = codigo.slice(0, -2);
        nodo.newHijo(nodoLista);
        nodo.newHijo(new Nodo($4));
        $$ = {code: $1+$2+codigo+$4, nodo: nodo, tipo: Tipo.NULL};
    }
;

//DONE
ListaExp
    : ListaExp COMA Expresion
    {
        $1.push($3);
        $$ = $1;
    }
    | Expresion
    {
        $$ = [$1];
    }
;

Parametros
    : Parametros COMA Param {
        $1.push($3);
        $$ = $1;
    }
    | Param{
        $$ = [$1];
    }
;

Param
    : ID DOSPUNTOS Tipo Dimensiones
    {
        nodo = new Nodo("Parametro");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo($4.nodo);
        tipo = $3.tipo;
        if($4.tipo != Tipo.NULL){
            tipo = $4.tipo;
        }
        $$ = {code: $1+" "+$2+$3.code+$4.code, nodo: nodo, tipo: tipo};
    }
    | ID
    {
        nodo = new Nodo("Parametro");
        nodo.newHijo(new Nodo($1));
        $$ = {code: $1, nodo: nodo, tipo: Tipo.ANY};
    }
;

NTReturn
    : TRETURN Expresion
    {
        nodo = new Nodo("Return");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo($2.nodo);
        $$ = {code: $1+" "+$2.code, nodo: nodo};
    }
    | TRETURN {
        nodo = new Nodo("Return");
        $$ = {code: $1, nodo: nodo};
    }
;

NTType
    : TTYPE ID IGUAL LLAVEIZQ ListaType LLAVEDER PUNTOYCOMA
    {
        nodo = new Nodo("Type");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        //Lista Atributos
        nodoLista = new Nodo("ListaAtributos");
        codigo = "";
        for(let a of $5){
            nodoLista.newHijo(a.nodo);
            codigo = codigo + a.code;
        }
        nodo.newHijo(nodoLista);
        $$ = {code: $1+" "+$2+$3+$4+"\n\t"+codigo+$6+$7, nodo: nodo, tipo: Tipo.TYPE};
    }
;

ListaType
    : ListaType Atributo
    {
        $1.push($2);
        $$ = $1;
    }
    | Atributo
    {
        $$ = [$1];
    }
;

Atributo
    : ID DOSPUNTOS Tipo Dimensiones FinType
    {
        nodo = new Nodo("Atributo");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo($4.nodo);
        $$ = {code: $1+" "+$2+$3.code+$4.code+$5.code+"\n", nodo: nodo, tipo: $3.tipo};
    }
;

FinType
    :   PUNTOYCOMA
    {
        $$ = { code: $1 };
    }
    |   COMA
    {
        $$ = { code: $1 };
    }
    |
    {
        $$ = { code: '' };
    }
;

Recuperar
    : PUNTOYCOMA
    |
;

Tipo
    : TNUMBER
    {
        node = new Nodo("Tipo");
        node.newHijo(new Nodo($1));
        $$ = {code: $1, nodo: node, tipo: Tipo.NUMBER};
    }
    | TSTRING 
    {
        node = new Nodo("Tipo");
        node.newHijo(new Nodo($1));
        $$ = {code: $1, nodo: node, tipo: Tipo.STRING};
    }
    | TBOOLEAN
    {
        node = new Nodo("Tipo");
        node.newHijo(new Nodo($1));
        $$ = {code: $1, nodo: node, tipo: Tipo.BOOLEAN};
    }
    | NULL
    {
        node = new Nodo("Tipo");
        node.newHijo(new Nodo($1));
        $$ = {code: $1, nodo: node, tipo: Tipo.NULL};
    }
    | TTYPE
    {
        node = new Nodo("Tipo");
        node.newHijo(new Nodo($1));
        $$ = {code: $1, nodo: node, tipo: Tipo.TYPE};
    }
    | TVOID
    {
        node = new Nodo("Tipo");
        node.newHijo(new Nodo($1));
        $$ = {code: $1, nodo: node, tipo: Tipo.VOID};
    }
    | ID
    {
        node = new Nodo("Tipo");
        node.newHijo(new Nodo($1));
        $$ = {code: $1, nodo: node, tipo: Tipo.TYPE};
    }
;


Dimensiones 
    : NumeroDim {
        node = new Nodo("Dimensiones");
        codigo = "";
        for(let i = 0; i<$1; i++){
            codigo = codigo + "[]";
        }
        node.newHijo(new Nodo(codigo));
        $$ = {code: codigo, nodo: node, tipo: Tipo.ARRAY};
    }
    | /*epsilon*/
    {
        $$ = {code: "", nodo: null, tipo: Tipo.NULL};
    }
;

NumeroDim
    : NumeroDim Dim
    {
        $$ = $1 + $2;
    }
    | Dim {
        $$ = $1;
    }
;

Dim 
    : CORIZQ CORDER
    {
        $$ = 1;
    }
;



Expresion
    : Expresion MAS Expresion
    {
        let nodo26 = new Nodo("Expresion");
        nodo26.newHijo($1.nodo);
        nodo26.newHijo(new Nodo($2));
        nodo26.newHijo($3.nodo);

        $$ = { code: $1.code+$2+$3.code, nodo: nodo26, tipo: Tipo.STRING };
    }       
    | Expresion MENOS Expresion
    {
        let nodo25 = new Nodo("Expresion");
        nodo25.newHijo($1.nodo);
        nodo25.newHijo(new Nodo($2));
        nodo25.newHijo($3.nodo);

        $$ = { code: $1.code+$2+$3.code, nodo: nodo25, tipo: Tipo.NUMBER };

    }
    | Expresion POR Expresion
    { 
        let nodo24 = new Nodo("Expresion");
        nodo24.newHijo($1.nodo);
        nodo24.newHijo(new Nodo($2));
        nodo24.newHijo($3.nodo);

        $$ = { code: $1.code+$2+$3.code, nodo: nodo24, tipo: Tipo.NUMBER };

    }       
    | Expresion DIV Expresion
    {
        let nodo23 = new Nodo("Expresion");
        nodo23.newHijo($1.nodo);
        nodo23.newHijo(new Nodo($2));
        nodo23.newHijo($3.nodo);

        $$ = { code: $1.code+$2+$3.code, nodo: nodo23, tipo: Tipo.NUMBER };
    }
    | Expresion MOD Expresion
    {
        let nodo22 = new Nodo("Expresion");
        nodo22.newHijo($1.nodo);
        nodo22.newHijo(new Nodo($2));
        nodo22.newHijo($3.nodo);

        $$ = { code: $1.code+$2+$3.code, nodo: nodo22, tipo: Tipo.NUMBER };

    }
    | Expresion POT Expresion
    {
        let nodo21 = new Nodo("Expresion");
        nodo21.newHijo($1.nodo);
        nodo21.newHijo(new Nodo($2));
        nodo21.newHijo($3.nodo);

        $$ = { code: $1.code+$2+$3.code, nodo: nodo21, tipo: Tipo.NUMBER };

    }
    | MENOS Expresion %prec UMENOS
    {
        let nodo20 = new Nodo("Expresion");
        nodo20.newHijo(new Nodo($1));
        nodo20.newHijo($2.nodo);

        $$ = { code: $1+$2.code, nodo: nodo20, tipo: $2.tipo };
    }
    | MAS Expresion %prec UMAS
    {
        let nodo19 = new Nodo("Expresion");
        nodo19.newHijo(new Nodo($1));
        nodo19.newHijo($2.nodo);

        $$ = { code: $1+$2.code, nodo: nodo19, tipo: $2.tipo };
    }
    | Expresion INC
    {
        let nodo18 = new Nodo("Expresion");
        nodo18.newHijo($1.nodo);
        nodo18.newHijo(new Nodo($2));

        $$ = { code: $1.code+$2, nodo: nodo18, tipo: $1.tipo };
    }
    | Expresion DEC
    {
        let nodo17 = new Nodo("Expresion");
        nodo17.newHijo($1.nodo);
        nodo17.newHijo(new Nodo($2));

        $$ = { code: $1.code+$2, nodo: nodo17, tipo: $1.tipo };
    }
    | NOT Expresion
    {
        let nodo16 = new Nodo("Expresion");
        nodo16.newHijo(new Nodo($1));
        nodo16.newHijo($2.nodo);

        $$ = { code: $1+ $2.code, nodo: nodo16, tipo: Tipo.BOOLEAN };
    }
    | Expresion MAYORQUE Expresion
    {
        let nodo15 = new Nodo("Expresion");
        nodo15.newHijo($1.nodo);
        nodo15.newHijo(new Nodo('\>'));
        nodo15.newHijo($3.nodo);
        $$ = { code: $1.code+$2+$3.code, nodo: nodo15, tipo: Tipo.BOOLEAN };
    }
    | Expresion MENORQUE Expresion
    {
        let nodo14 = new Nodo("Expresion");
        nodo14.newHijo($1.nodo);
        nodo14.newHijo(new Nodo('\<'));
        nodo14.newHijo($3.nodo);
        $$ = { code: $1.code+$2+$3.code, nodo: nodo14, tipo: Tipo.BOOLEAN };
    }
    | Expresion MAYORIGUAL Expresion
    {
        let nodo13 = new Nodo("Expresion");
        nodo13.newHijo($1.nodo);
        nodo13.newHijo(new Nodo('\>='));
        nodo13.newHijo($3.nodo);
        $$ = { code: $1.code+$2+$3.code, nodo: nodo13, tipo: Tipo.BOOLEAN };
    }
    | Expresion MENORIGUAL Expresion
    {
        nodo = new Nodo("Expresion");
        nodo.newHijo($1.nodo);
        nodo.newHijo(new Nodo('\<='));
        nodo.newHijo($3.nodo);
        $$ = { code: $1.code+$2+$3.code, nodo: nodo, tipo: Tipo.BOOLEAN };
    }
    | Expresion IGUALIGUAL Expresion
    {
        let nodo12 = new Nodo("Expresion");
        nodo12.newHijo($1.nodo);
        nodo12.newHijo(new Nodo('=='));
        nodo12.newHijo($3.nodo);
        $$ = { code: $1.code+$2+$3.code, nodo: nodo12, tipo: Tipo.BOOLEAN };
    }
    | Expresion DESIGUAL Expresion
    {
        let nodo11 = new Nodo("Expresion");
        nodo11.newHijo($1.nodo);
        nodo11.newHijo(new Nodo('!='));
        nodo11.newHijo($3.nodo);
        $$ = { code: $1.code+$2+$3.code, nodo: nodo11, tipo: Tipo.BOOLEAN };
    }
    | Expresion AND Expresion
    {
        let nodo10 = new Nodo("Expresion");
        nodo10.newHijo($1.nodo);
        nodo10.newHijo(new Nodo($2));
        nodo10.newHijo($3.nodo);
        $$ = { code: $1.code+$2+$3.code, nodo: nodo10, tipo: Tipo.NULL };
    }
    | Expresion OR Expresion
    {
        let nodo9 = new Nodo("Expresion");
        nodo9.newHijo($1.nodo);
        nodo9.newHijo(new Nodo($2));
        nodo9.newHijo($3.nodo);
        $$ = { code: $1.code+$2+$3.code, nodo: nodo9, tipo: Tipo.NULL };
    }
    | Expresion INTER Expresion DOSPUNTOS Expresion
    {
        let nodo8 = new Nodo("Expresion");
        nodo8.newHijo($1.nodo);
        nodo8.newHijo(new Nodo($2));
        nodo8.newHijo($3.nodo);
        nodo8.newHijo(new Nodo($4));
        nodo8.newHijo($5.nodo);
        $$ = { code: $1.code+$2+$3.code+$4+$5.code, nodo: nodo8, tipo: Tipo.NULL };
    }
    | F
    {
        $$ = $1;
    }
;


F   : PARIZQ Expresion PARDER
    { 
        let nodo7 = new Nodo("Expresion");
        nodo7.newHijo($2.nodo);
        $$ = { code: $1+$2.code+$3, nodo: nodo7, tipo: $2.tipo };
    }
    | NUMBER
    { 
        let nodo6 = new Nodo($1);
        $$ = { code: $1, nodo: nodo6, tipo: Tipo.NUMBER };
    }
    | BOOLEAN
    {
        let nodo05 = new Nodo($1);
        $$ = { code: $1, nodo: nodo05, tipo: Tipo.BOOLEAN };
    }
    | NULL
    {
        let nodo5 = new Nodo($1);
        $$ = { code: $1, nodo: nodo5, tipo: Tipo.NULL };
    }
    | STRING
    {
        let nodo4 = new Nodo($1);
        $$ = { code: $1, nodo: nodo4, tipo: Tipo.STRING };
    }
    | ID
    {
        let nodo2 = new Nodo($1);
        $$ = { code: $1, nodo: nodo2, tipo: Tipo.NULL };
    }
    | NTCall //DONE
    {
        $$ = $1;
    }
    | callType //TODO 
    {
        $$ = $1;
    }
    | Accesos //TODO
    {
        $$ = $1;
    }
    | valorArray { //DONE
        $$ = $1;
    }
;

//Accesos pueden ser ID.ID, ID[INDICE], ID.FUNCION();

Accesos
    : Accesos PUNTO ID
    {
        nodo = new Nodo("Acceso Type");
        nodo.newHijo($1.nodo);
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        $$ = {code: $1.code+$2+$3, nodo: nodo, tipo: Tipo.TYPE};
    }
    | Acceso
    {
        $$ = $1;
    }
    | Accesos CORIZQ Expresion CORDER
    { 
        nodo = new Nodo("Acceso Array");
        nodo.newHijo($1.nodo);
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo(new Nodo($4));
        $$ = {code: $1.code+$2+$3.code+$4, nodo: nodo, tipo: Tipo.ARRAY};
    }
    | Accesos PUNTO PUSH PARIZQ Expresion PARDER
    {
        nodo = new Nodo("Acceso Push");
        nodo.newHijo($1.nodo);
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        nodo.newHijo($5.nodo);
        nodo.newHijo(new Nodo($6));
        $$ = {code: $1.code+$2+$3+$4+$5.code+$6, nodo: nodo, tipo: Tipo.NUMBER};
    }
    | Accesos PUNTO POP PARIZQ PARDER
    {
        nodo = new Nodo("Acceso Pop");
        nodo.newHijo($1.nodo);
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        nodo.newHijo(new Nodo($5));
        $$ = {code: $1.code+$2+$3+$4+$5, nodo: nodo, tipo: $1.tipo};
    }
;

Acceso 
    : ID PUNTO ID
    {
        nodo = new Nodo("Acceso Type");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        $$ = {code: $1+$2+$3, nodo: nodo, tipo: Tipo.TYPE};
    }
    | ID CORIZQ Expresion CORDER 
    {
        nodo = new Nodo("Acceso Array");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo($3.nodo);
        nodo.newHijo(new Nodo($4));
        $$ = {code: $1+$2+$3.code+$4, nodo: nodo, tipo: Tipo.ARRAY};
    }
    | ID PUNTO PUSH PARIZQ Expresion PARDER
    {
        nodo = new Nodo("Acceso Push");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        nodo.newHijo($5.nodo);
        nodo.newHijo(new Nodo($6));
        $$ = {code: $1+$2+$3+$4+$5.code+$6, nodo: nodo, tipo: Tipo.NUMBER};
    }
    | ID PUNTO POP PARIZQ PARDER
    {
        nodo = new Nodo("Acceso Pop");
        nodo.newHijo(new Nodo($1));
        nodo.newHijo(new Nodo($2));
        nodo.newHijo(new Nodo($3));
        nodo.newHijo(new Nodo($4));
        nodo.newHijo(new Nodo($5));
        $$ = {code: $1+$2+$3+$4+$5, nodo: nodo, tipo: Tipo.ARRAY};
    }
;

callType
    : LLAVEIZQ ListaTypeExp LLAVEDER
    {
        nodo = new Nodo("Call Type");
        //Lista Atributos
        nodoLista = new Nodo("Lista Atributos");
        codigo = "";
        for(let a of $2){
            nodoLista.newHijo(a.nodo);
            codigo = codigo + a.code + ", ";
        }
        codigo = codigo.slice(0, -2);
        nodo.newHijo(nodoLista);
        $$ = {code: $1+codigo+$3, nodo: nodo, tipo: Tipo.TYPE};
    }
;

ListaTypeExp
    : ListaTypeExp COMA AtributoExp
    {
        $1.push($3);
        $$ = $1;
    }
    | AtributoExp
    {
        $$ = [$1];
    }
;

AtributoExp
    : ID DOSPUNTOS Expresion
    {
        let nodo3 = new Nodo('AtributoExp');
        nodo3.newHijo(new Nodo($1));
        nodo3.newHijo(new Nodo($2));
        nodo3.newHijo($3.nodo);

        $$ = { code: $1+$2+$3.code, nodo: nodo3 };
    }
;

valorArray
    : CORIZQ ListaExp CORDER {
        node = new Nodo('valorArray');
        nodoLista = new Nodo("ListaExpresion");
        codigo = "";
        for(let a of $2){
            nodoLista.newHijo(a.nodo);
            codigo = codigo + a.code + ", ";
        }
        codigo = codigo.slice(0, -2);

        valorLista = { code: codigo, nodo: nodoLista, tipo: Tipo.ARRAY };
        node.newHijo(valorLista.nodo);

        $$ = { code: "["+valorLista.code+"]", nodo: node, tipo: Tipo.ARRAY };
    }
    | CORIZQ CORDER {
        node = new Nodo('valorArray');
        node.newHijo(new Nodo('[ ]'));

        $$ = { code: "[]", nodo: node, tipo: Tipo.ARRAY };
    }
;

