import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import {
  PoCheckboxGroupOption, PoComboOption, PoRadioGroupOption, PoDisclaimer, PoDisclaimerGroup,
  PoModalComponent, PoModalAction, PoNotificationService, PoPageFilter, PoPageAction,
  PoTableAction, PoTableColumn, PoTableComponent
} from '@portinari/portinari-ui';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html'
})
export class CustomerListComponent implements OnInit, OnDestroy {

  private readonly url: string = 'https://app.vindi.com.br/api/v1/issues?query=created_at:2021-04-06 AND status:open';

  private customerRemoveSub: Subscription;
  private customersRemoveSub: Subscription;
  private customersSub: Subscription;
  private page: number = 1;
  private searchTerm: string = '';
  private searchFilters: any;

  public readonly cityService: string = 'https://app.vindi.com.br/api/v1/issues?query=created_at:2021-04-06 AND status:open';

  public readonly actions: Array<PoPageAction> = [
  ];

  public readonly advancedFilterSecondaryAction: PoModalAction = {
    action: () => this.advancedFilter.close(),
    label: 'Cancelar'
  };

  // public readonly cityOptions: Array<PoComboOption> = [
  //   { label: 'Araquari', value: 'Araquari' },
  //   { label: 'Belém', value: 'Belém' },
  //   { label: 'Campinas', value: 'Campinas' },
  //   { label: 'Curitiba', value: 'Curitiba' },
  //   { label: 'Joinville', value: 'Joinville' },
  //   { label: 'Osasco', value: 'Osasco' },
  //   { label: 'Rio de Janeiro', value: 'Rio de Janeiro' },
  //   { label: 'São Bento', value: 'São Bento' },
  //   { label: 'São Francisco', value: 'São Francisco' },
  //   { label: 'São Paulo', value: 'São Paulo' }
  // ];
  public readonly columns: Array<PoTableColumn> = [
    { property: 'customer.name', label: 'Nome' },
    { property: 'customer.email', label: 'E-mail', type: 'link' },
    { property: 'created_at', label: 'Data', type: 'date', format: 'dd/MM/yyyy', width: '100px' },
    { property: 'data.transaction_amount', label: 'Valor', type: 'currency' },
    { property: 'status', type: 'label', labels: [
      { value: 'open', color: 'color-10', label: 'Em aberto' },
      { value: 'closed', color: 'color-07', label: 'Encerrado' }
    ]}
  ];


  public readonly genreOptions: Array<PoRadioGroupOption> = [
    { label: 'Feminino', value: 'female' },
    { label: 'Masculino', value: 'male' },
    { label: 'Outros', value: 'other' }
  ];

  public readonly statusOptions: Array<PoCheckboxGroupOption> = [
    { label: 'Ativo', value: 'active' },
    { label: 'Inativo', value: 'inactive' }
  ];

  public readonly tableActions: Array<PoTableAction> = [
  ];

  public city: string;
  public customers: Array<any> = [];
  public genre: string;
  public hasNext: boolean = false;
  public loading: boolean = true;
  public name: string;
  public status: Array<string> = [];

  @ViewChild('advancedFilter', { static: true }) advancedFilter: PoModalComponent;
  @ViewChild('table', { static: true }) table: PoTableComponent;

  constructor(private httpClient: HttpClient, private router: Router, private poNotification: PoNotificationService) { }
  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json'})
  }

  ngOnInit() {
    this.loadData();
  }

  ngOnDestroy() {
    this.customersSub.unsubscribe();

    if (this.customerRemoveSub) {
      this.customerRemoveSub.unsubscribe();
    }

    if (this.customersRemoveSub) {
      this.customersRemoveSub.unsubscribe();
    }
  }

  // get title() {
  //   return `Lista de clientes (${this.hasNext ? '+ de ' : ''}${this.customers.length})`;
  // }

  openAdvancedFilter() {
    this.advancedFilter.open();
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

  private canEditCustomer(customer) {
    return customer.status !== 'active';
  }

  private loadData(params: { page?: number, search?: string } = { }) {
    this.loading = true;

    this.customersSub = this.httpClient.get(this.url, { params: <any>params, headers: { authorization: 'Basic Vnp0MjBHbFBfVVAxYjF3NVZBQ2lFMWhDZVF5WWtFUW9kN0wyVTNiMEVaQQ==', contentType: 'application/json', origin: 'https://www.google.com.br' } })
      .subscribe((response: { issues: Array<any>}) => {
        this.customers = response.issues
        this.customers.forEach
        //this.hasNext = response.issues;
        this.loading = false;
      });
  }

  private onChangeDisclaimerGroup(disclaimers: Array<PoDisclaimer>) {
    this.searchFilters = {};

    this.page = 1;

    disclaimers.forEach(disclaimer => {
      this.searchFilters[disclaimer.property] = disclaimer.value;
    });

    if (!this.searchFilters.search) {
      this.searchTerm = undefined;
    }

    this.loadData(this.searchFilters);
  }

    private onEditCustomer(customer) {
    this.router.navigateByUrl(`/customers/edit/${customer.id}`);
  }

  private onNewCustomer() {
    this.router.navigateByUrl('/customers/new');
  }

  private onRemoveCustomer(customer) {
    this.customerRemoveSub = this.httpClient.delete(`${this.url}/${customer.id}`)
      .subscribe(() => {
        this.poNotification.warning('Cadastro do cliente apagado com sucesso.');

        this.customers.splice(this.customers.indexOf(customer), 1);
      });
  }

  private onRemoveCustomers() {
    const selectedCustomers = this.table.getSelectedRows();
    const customersWithId = selectedCustomers.map(customer => ({ id: customer.id}));

    this.customersRemoveSub = this.httpClient.request('delete', this.url, { body: customersWithId } )
      .subscribe(() => {
        this.poNotification.warning('Clientes apagados em lote com sucesso.');

        selectedCustomers.forEach(customer => {
          this.customers.splice(this.customers.indexOf(customer), 1);
        });
      });
  }

  private onViewCustomer(customer) {
    this.router.navigateByUrl(`/customers/view/${customer.id}`);
  }

  private sendMail(email, customer) {
    const body = `Olá ${customer.name}, gostariamos de agradecer seu contato.`;
    const subject = 'Contato';

    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_self');
  }

}
