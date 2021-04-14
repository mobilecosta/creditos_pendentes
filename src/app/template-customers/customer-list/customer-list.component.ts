import { Component } from '@angular/core';

import {
  PoNotificationService, PoPageAction, PoTableAction, PoTableColumn, PoTableComponent
} from '@portinari/portinari-ui';
import { PoPageDynamicTableActions } from '@portinari/portinari-templates';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent {

  public readonly serviceApi: string = 'https://app.vindi.com.br/api/v1/issues?query=created_at:2021-04-06 AND status:open';

  public readonly cityService: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/cities';

  public readonly actions: PoPageDynamicTableActions = {
    detail: 'template-customers/view/:id',
    duplicate: 'template-customers/new',
    edit: 'template-customers/edit/:id',
    new: 'template-customers/new',
    remove: true,
    removeAll: true
  };

  public readonly fields: Array<any> = [
    { property: 'id', visible: false, key: true },
    { property: 'customer.name', label: 'Nome', filter: true, gridColumns: 6 },
    { property: 'email', label: 'E-mail', type: 'link', action: this.sendMail.bind(this) },
    { property: 'created_at', label: 'Data', type: 'date', format: 'dd/MM/yyyy', width: '100px' },
    { property: 'data.transaction_amount', label: 'Valor' },
    { property: 'status', type: 'label', optionsMulti: true, filter: true, gridColumns: 5,
      options: [
        { value: 'open', label: 'Ativo' },
        { value: 'closed', label: 'Inativo' }
      ],
      labels: [
        { value: 'active', color: 'color-10', label: 'Ativo' },
        { value: 'inactive', color: 'color-07', label: 'Inativo' }
      ]
    }
  ];

  private sendMail(email, customer) {
    const body = `Olá ${customer.name}, gostariamos de agradecer seu contato.`;
    const subject = 'Contato';

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }

}
