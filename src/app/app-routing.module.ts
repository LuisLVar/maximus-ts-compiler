import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsolaComponent } from './components/consola/consola.component';
import { ReportesComponent } from './components/reportes/reportes.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/consola',
    pathMatch: 'full'
  },
  {
    path: 'consola',
    component: ConsolaComponent
  },
  {
    path: 'reportes',
    component: ReportesComponent
  },
  {
    path: "**",
    redirectTo: '/consola',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
