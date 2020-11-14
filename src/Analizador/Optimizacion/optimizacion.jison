%{
    const {errores} = require ('../Error/Errores');
    const {Error_} = require('../Error/Error')
    //Instrucciones

%}

%lex
%options case-insensitive

entero  [0-9]+
number {entero}("."{entero})?
id ([a-zA-Z_])[a-zA-Z0-9_ñÑ]*
temporal T{entero}
label    L{entero}

%%
\s+                   /* Se ignoran espacios en blanco */
"//".*										// comentario una línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiples líneas


//Variables


{number}                return 'NUMBER';
{temporal}              return 'TEMPORAL';
{label}                 return 'LABEL';


"void"                   return "VOID";
"stack"                  return "STACK";
"heap"                   return "HEAP";
"double"                 return "double";
"p"                      return "P";
"h"                      return "H";
"return"                 return "TRETURN";

"#include <stdio.h>"     return "STDIO"
"#include <math.h>"      return "MATH"

//Operaciones

"+"                     return 'MAS';
"-"                     return 'MENOS';
"*"                     return 'POR';
"/"                     return 'DIV';

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

{id}	                return 'ID';

<<EOF>>		            return 'EOF';
.					    { errores.push(new Error_(yylloc.first_line, yylloc.first_column, "Léxico", yytext, )); }

/lex

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
    : Asignacion PUNTOYCOMA
    {
        $$ = $1;
    }
    | AddLabel
    {
        $$ = $1;
    }
    | Goto PUNTOYCOMA
    {
        $$ = $1;
    }
    | Funcion
    {
        $$ = $1;
    }
    | NTIF PUNTOYCOMA
    {
        $$ = $1;
    }
    | PRINT PUNTOYCOMA
    {
        $$ = $1;
    }
    | TRETURN PUNTOYCOMA
    {
        $$ = $1;
    }
;