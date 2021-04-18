import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditosFormComponent } from './creditos-form/creditos-form.component';
import { CreditosListComponent } from './creditos-list/creditos-list.component';
import { CreditosViewComponent } from './creditos-view/creditos-view.component';

const routes: Routes = [
  { path: '', component: CreditosListComponent },
  { path: 'new', component: CreditosFormComponent },
  { path: 'view/:id', component: CreditosViewComponent },
  { path: 'edit/:id', component: CreditosFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditosRoutingModule { }
