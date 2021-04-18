import { NgModule } from '@angular/core';

import { PoTemplatesModule } from '@portinari/portinari-templates';

import { SharedModule } from '../shared/shared.module';

import { CreditosRoutingModule } from './creditos-routing.module';
import { CreditosFormComponent } from './creditos-form/creditos-form.component';
import { CreditosListComponent } from './creditos-list/creditos-list.component';
import { CreditosViewComponent } from './creditos-view/creditos-view.component';

@NgModule({
  declarations: [
    CreditosFormComponent,
    CreditosListComponent,
    CreditosViewComponent
  ],
  imports: [
    PoTemplatesModule,

    SharedModule,

    CreditosRoutingModule,
  ]
})
export class CreditosModule { }
