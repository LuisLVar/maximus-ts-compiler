import Parser from './traduccion';

export function Traductor(cadena:string) { 
  return Parser.parse(cadena);
}