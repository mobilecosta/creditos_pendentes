import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { PoNotificationService, PoPageAction, PoTableAction, PoTableColumn, PoTableComponent } from '@po-ui/ng-components';

@Component({
  selector: 'app-creditos-list',
  templateUrl: './creditos-list.component.html'
})
export class CreditosListComponent implements OnInit, OnDestroy {

  private readonly url: string = 'https://app.vindi.com.br/api/v1/issues?query=status:open&per_page=50&sort_order=desc';

  private creditosRemoveSub: Subscription;
  private creditossRemoveSub: Subscription;
  private creditossSub: Subscription;
  private page: number = 1;
  private searchTerm: string = '';
  private searchFilters: any = { };

  public readonly actions: Array<PoPageAction> = [
    //{ action: this.onNewcreditos.bind(this), label: 'Cadastrar', icon: 'po-icon-user-add' },
    //{ action: this.onRemovecreditoss.bind(this), label: 'Remover clientes' }
  ];

  public readonly filters: Array<any> = [
    { property: 'name', label: 'Nome', gridColumns: 6 },
    { property: 'status', type: 'Status', gridColumns: 5, optionsMulti: true, options: [
      { value: 'active', label: 'Ativo' },
      { value: 'inactive', label: 'Inativo' }
    ]}
  ];

  public readonly columns: Array<PoTableColumn> = [
    { property: 'idcustomer', label: 'Id' },
    { property: 'name', label: 'Nome' },
    { property: 'email', label: 'E-mail', type: 'link', action: this.sendMail.bind(this) },
    { property: 'created_at', label: 'Data', type: 'date', format: 'dd/MM/yyyy', width: '100px' },
    { property: 'expected_amount', label: 'Valor esperado', type: 'currency', width: '150px' },
    { property: 'transaction_amount', label: 'Valor pago', type: 'currency', width: '100px' },
    { property: 'status', type: 'label', width: '100px', labels: [
      { value: 'open', color: 'color-10', label: 'Aberto' },
      { value: 'closed', color: 'color-07', label: 'Fechado' }
    ]}
  ];

  public readonly tableActions: Array<PoTableAction> = [
    { action: this.onViewcreditos.bind(this), label: 'Visualizar' },
    { action: this.onEditcreditos.bind(this), disabled: this.canEditcreditos.bind(this), label: 'Editar' },
    { action: this.onRemovecreditos.bind(this), label: 'Remover', type: 'danger', separator: true }
  ];

  public creditos: Array<any> = [];
  public hasNext: boolean = false;
  public loading: boolean = true;

  @ViewChild('table', { static: true }) table: PoTableComponent;

  constructor(private httpClient: HttpClient, private router: Router, private poNotification: PoNotificationService) { }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.creditossSub.unsubscribe();

    if (this.creditosRemoveSub) {
      this.creditosRemoveSub.unsubscribe();
    }

    if (this.creditossRemoveSub) {
      this.creditossRemoveSub.unsubscribe();
    }
  }

  changeDisclaimers(event) {
    this.searchTerm = '';
    this.searchFilters = {};

    this.page = 1;

    event.forEach(disclaimer => {
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });

    this.loadData(this.searchFilters);
  }

  sortBy(event) {
    let params: any = {};

    this.page = 1;

    if (event) {
      params.order = `${event.type === 'ascending' ? '' : '-'}${event.column.property}`;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    } else {
      params = { ...params, ...this.searchFilters };
    }

    this.loadData(params);
  }

  showMore(event) {
    let params: any = {
      page: ++this.page,
    };

    if (event) {
      params.order = `${event.type === 'ascending' ? '' : '-'}${event.column.property}`;
    }

    if (this.searchTerm) {
      params.search = this.searchTerm;
    } else {
      params = { ...params, ...this.searchFilters };
    }

    this.loadData(params);
  }

  private canEditcreditos(creditos) {
    return creditos.status !== 'active';
  }

  private loadData(params: { page?: number, search?: string } = { }) {
    this.loading = true;
    this.hasNext =  false;
    console.log(params.page);
    this.creditossSub = this.httpClient.get(this.url, 
      { params: <any>params, headers: 
      { authorization: 'Basic Vnp0MjBHbFBfVVAxYjF3NVZBQ2lFMWhDZVF5WWtFUW9kN0wyVTNiMEVaQQ==', 
        contentType: 'application/json' } })
      
      .subscribe((response: { issues: Array<any> }) => {
        let issuesret: Array<any> = [];
		    response.issues.forEach( linhas => {
  			let linha: Array<any> = [];
          linha['id'] = linhas.id
          linha['issue_type'] = linhas.issue_type
          linha['status'] = linhas.status
          linha['item_type'] = linhas.item_type
          linha['item_id'] = linhas.item_id
          linha['expected_amount'] = linhas.data.expected_amount
          linha['transaction_amount'] = linhas.data.transaction_amount
          linha['created_at'] = linhas.created_at
          linha['updated_at'] = linhas.updated_at
          linha['idcustomer'] = linhas.customer.id
          linha['name'] = linhas.customer.name
          linha['email'] = linhas.customer.email
          issuesret.push(linha)
          this.hasNext =  true; 
        }

        )
        this.creditos = !params.page || params.page === 1
          ? issuesret
          : [...this.creditos, ...issuesret];
        this.loading = false;
      });
  }


  public quickSearch(event) {
    this.page = 1;

    this.searchTerm = event;
    this.searchFilters = {};

    this.loadData(event ? { search: event } : {});
  }

  public advancedSearch(event) {
    this.page = 1;

    this.searchTerm = '';
    this.searchFilters = event;

    this.loadData(event);
  }

  private onEditcreditos(creditos) {
    this.router.navigateByUrl(`/creditos/edit/${creditos.id}`);
  }

  private onNewcreditos() {
    this.router.navigateByUrl('/creditos/new');
  }

  private onRemovecreditos(creditos) {
    this.creditosRemoveSub = this.httpClient.delete(`${this.url}/${creditos.id}`)
      .subscribe(() => {
        this.poNotification.warning('Cadastro do cliente apagado com sucesso.');

        this.creditos.splice(this.creditos.indexOf(creditos), 1);
      });
  }

  private onRemovecreditoss() {
    const selectedcreditoss = this.table.getSelectedRows();
    const creditossWithId = selectedcreditoss.map(creditos => ({ id: creditos.id}));

    this.creditossRemoveSub = this.httpClient.request('delete', this.url, { body: creditossWithId } )
      .subscribe(() => {
        this.poNotification.warning('Clientes apagados em lote com sucesso.');

        selectedcreditoss.forEach(creditos => {
          this.creditos.splice(this.creditos.indexOf(creditos), 1);
        });
      });
  }

  private onViewcreditos(creditos) {
    this.router.navigateByUrl(`/creditos/view/${creditos.id}`);
  }

  private sendMail(email, creditos) {
    const body = `Olá ${creditos.name}, gostariamos de agradecer seu contato.`;
    const subject = 'Contato';

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }

}
