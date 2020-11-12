import { Component, OnInit } from '@angular/core';
import { errores } from '../../../Analizador/Error/Errores';
import { tablaSimbolos, RaizAST } from '../salidas/salidas'
import { graphviz } from 'd3-graphviz'
import { wasmFolder } from '@hpcc-js/wasm'
import { Nodo } from '../../../Analizador/AST/Nodo';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {

  grafica: string = "";

  constructor() { }

  ngOnInit(): void {
    wasmFolder('https://cdn.jsdelivr.net/npm/@hpcc-js/wasm@0.3.13/dist');
  }

  imprimirAST() { 
    this.generarAST();
    graphviz('#idAST').renderDot(this.grafica);
  }

  generarAST() { 
    this.grafica = `digraph D {
node [shape=record fontname="Aria" style=filled, fillcolor=azure1];
nodo0[label="init"];
nodo0 -> nodo${RaizAST.raiz.nodo.getId()};`;
    this.grafica = this.grafica + this.recorrerAST(RaizAST.raiz.nodo) + "}";
  }

  recorrerAST(nodo: Nodo): string { 
    let cadenaNodo = "nodo" + nodo.getId() + "[label=\" " + nodo.getNombre().replace(/["]+/g, '').replace(/[']+/g, '') + "  \"];\n";
    for (let hijo of nodo.getHijos()) { 
      if (hijo != null) { 
        cadenaNodo = cadenaNodo + "nodo" + nodo.getId() + "->" + "nodo" + hijo.getId() + "\n"; //nodo2->nodo3;
        cadenaNodo = cadenaNodo + this.recorrerAST(hijo);
      }
    }
    return cadenaNodo;
  }


  listaErrores = errores;
  TS = tablaSimbolos;


}
