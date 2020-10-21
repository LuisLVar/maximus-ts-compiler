%{
    const {errores} = require ('../Error/Errores');
    const {Error_} = require('../Error/Error')
    //Instrucciones
    const {Print} = require('../Instrucciones/Funciones/Print');
    const {Declaracion} = require('../Instrucciones/Variables/Declaracion');
    
    //Expresiones
    const {Variable} = require('../Expresion/Literales/Variable');
    const {Literal} = require('../Expresion/Literales/Literal');
    const {Aritmetica, tipoAritmetica} = require('../Expresion/Basicas/Aritmetica');
    const {Unario, tipoUnario} = require('../Expresion/NoBinaria/Unario');
    const {Relacional, tipoRelacional} = require('../Expresion/Basicas/Relacional');
    const {Logica, tipoLogica} = require('../Expresion/Basicas/Logica');
    const {Ternario} = require('../Expresion/NoBinaria/Ternario');
%}

%lex
%options case-insensitive

entero  [0-9]+
number {entero}("."{entero})?
string  ((\"[^"]*\")|(\'[^']*\'))
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

"\\"                     return 'DINVERT'     


{id}	                return 'ID';

<<EOF>>		            return 'EOF';
.					    { errores.push(new Error_(yylloc.first_line, yylloc.first_column, "Léxico", yytext, )); }

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
        return $1;
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


Instruccion
    : Imprimir 
    {
        $$ = $1;
    }    
    | Declaracion
    {
        $$ = $1;
    
    }
    | Asignacion
    {
        $$ = $1;
    }
    | error Recuperar
    { 
        errores.push(new Error_(@1.first_line, @1.first_column, "Sintáctico", "Se esperaba: "+ yytext));
    }
;

Declaracion
    : LET ID DOSPUNTOS Tipo Dimensiones IGUAL Expresion PUNTOYCOMA // Para Arrays
    {
        let dim1 = $5;
        let declaracion1 = new Declaracion($2, { tipo: $4, dim: dim1 }, $7, 1, @1.first_line, @1.first_column);
        $$ = declaracion1;
    }
    | LET ID DOSPUNTOS Tipo Dimensiones PUNTOYCOMA // Para arrays
    {
        let dim2 = $5;
        let declaracion2 = new Declaracion($2, { tipo: $4, dim: dim2 }, null, 1, @1.first_line, @1.first_column);
        $$ = declaracion2;
    }
    | CONST ID DOSPUNTOS Tipo Dimensiones IGUAL Expresion PUNTOYCOMA
    {
        let dim3 = $5;
        let declaracion3 = new Declaracion($2, { tipo: $4, dim: dim3 }, $7, 2, @1.first_line, @1.first_column);
        $$ = declaracion3;
    }
    | CONST ID DOSPUNTOS Tipo Dimensiones PUNTOYCOMA
    {
        let dim4 = $5;
        let declaracion4 = new Declaracion($2, { tipo: $4, dim: dim4 }, null, 2, @1.first_line, @1.first_column);
        $$ = declaracion4;
    }
;


Asignacion
    : ID IGUAL Expresion PUNTOYCOMA
    {
        $$ = new Asignacion($1, $3, @1.first_line, @1.first_column);
    }
    | ID INC PUNTOYCOMA
    {
        $$ = new Asignacion($1, new Unario( 
            new Variable($1, @1.first_line, @1.first_column),
             tipoUnario.INC, @1.first_line,@1.first_column), @1.first_line,@1.first_column);
    }
    | ID DEC PUNTOYCOMA
    {
        $$ = new Asignacion($1, new Unario( 
            new Variable($1, @1.first_line, @1.first_column),
             tipoUnario.DEC, @1.first_line,@1.first_column), @1.first_line,@1.first_column);
    }
    | AccesosA IGUAL Expresion PUNTOYCOMA
    {
        $$ = new AsignarAcceso($1, $3, @1.first_line, @1.first_column);
    }
;

Tipo
    : TNUMBER
    {
        $$ = 0;
    }
    | TSTRING 
    {
        $$ = 1;
    }
    | TBOOLEAN
    {
        $$ = 2;
    }
    | NULL
    {
        $$ = 3;
    }
    | TTYPE
    {
        $$ = 5;
    }
    | TVOID
    {
        $$ = 6;
    }
    | ID
    {
        $$ = $1;
    }
;


Dimensiones 
    : NumeroDim {
        $$ = $1;
    }
    | /*epsilon*/
    {
        $$ = 0;
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


Imprimir
    : CONSOLELOG PARIZQ ListaExp PARDER PUNTOYCOMA 
    {
        $$ = new Print($3, @1.first_line, @1.first_column);
    }
;

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


Expresion
    : Expresion MAS Expresion
    {
        $$ = new Aritmetica($1, $3, tipoAritmetica.MAS, @1.first_line,@1.first_column);
    }       
    | Expresion MENOS Expresion
    {
        $$ = new Aritmetica($1, $3, tipoAritmetica.MENOS, @1.first_line,@1.first_column);
    }
    | Expresion POR Expresion
    { 
        $$ = new Aritmetica($1, $3, tipoAritmetica.POR, @1.first_line,@1.first_column);
    }       
    | Expresion DIV Expresion
    {
        $$ = new Aritmetica($1, $3, tipoAritmetica.DIV, @1.first_line,@1.first_column);
    }
    | Expresion MOD Expresion
    {
        $$ = new Aritmetica($1, $3, tipoAritmetica.MOD, @1.first_line,@1.first_column);
    }
    | Expresion POT Expresion
    {
        $$ = new Aritmetica($1, $3, tipoAritmetica.POT, @1.first_line,@1.first_column);
    }
    | MENOS Expresion %prec UMENOS
    {
        $$ = new Unario($2, tipoUnario.UMENOS, @1.first_line,@1.first_column);
    }
    | MAS Expresion %prec UMAS
    {
        $$ = new Unario($2, tipoUnario.UMAS, @1.first_line,@1.first_column);
    }
    | Expresion INC
    {
        $$ = new Unario($1, tipoUnario.INC, @1.first_line,@1.first_column);
    }
    | Expresion DEC
    {
        $$ = new Unario($1, tipoUnario.DEC, @1.first_line,@1.first_column);
    }
    | NOT Expresion
    {
        $$ = new Unario($2, tipoUnario.NOT, @1.first_line,@1.first_column);
    }
    | Expresion MAYORQUE Expresion
    {
        $$ = new Relacional($1, $3, tipoRelacional.MAYORQUE, @1.first_line,@1.first_column);
    }
    | Expresion MENORQUE Expresion
    {
        $$ = new Relacional($1, $3, tipoRelacional.MENORQUE, @1.first_line,@1.first_column);
    }
    | Expresion MAYORIGUAL Expresion
    {
        $$ = new Relacional($1, $3, tipoRelacional.MAYORIGUAL, @1.first_line,@1.first_column);
    }
    | Expresion MENORIGUAL Expresion
    {
        $$ = new Relacional($1, $3, tipoRelacional.MENORIGUAL, @1.first_line,@1.first_column);
    }
    | Expresion IGUALIGUAL Expresion
    {
        $$ = new Relacional($1, $3, tipoRelacional.IGUALIGUAL, @1.first_line,@1.first_column);
    }
    | Expresion DESIGUAL Expresion
    {
        $$ = new Relacional($1, $3, tipoRelacional.DESIGUAL, @1.first_line,@1.first_column);
    }
    | Expresion AND Expresion
    {
        $$ = new Logica($1, $3, tipoLogica.AND, @1.first_line,@1.first_column);
    }
    | Expresion OR Expresion
    {
        $$ = new Logica($1, $3, tipoLogica.OR, @1.first_line,@1.first_column);
    }
    | Expresion INTER Expresion DOSPUNTOS Expresion
    {
        $$ = new Ternario($1, $3, $5, @1.first_line, @1.first_column);
    }
    | F
    {
        $$ = $1;
    }
;


F   : PARIZQ Expresion PARDER
    { 
        $$ = $2;
    }
    | NUMBER
    { 
        $$ = new Literal($1, @1.first_line, @1.first_column, 0);
    }
    | STRING
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 1);
    }
    | BOOLEAN
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 2);
    }
    | NULL
    {
        $$ = new Literal($1, @1.first_line, @1.first_column, 3);
    }
    | ID
    {
        $$ = new Variable($1, @1.first_line, @1.first_column);
    }
;

Recuperar
    : PUNTOYCOMA
    |
;
