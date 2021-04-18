import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PoNotificationService } from '@po-ui/ng-components';

const actionInsert = 'insert';
const actionUpdate = 'update';

@Component({
  selector: 'app-creditos-form',
  templateUrl: './creditos-form.component.html'
})
export class CreditosFormComponent implements OnDestroy, OnInit {

  private readonly url: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/people';

  private action: string = actionInsert;
  private creditosSub: Subscription;
  private paramsSub: Subscription;

  public readonly cityService: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/cities';
  public readonly stateService: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/states';

  fields = [
    { property: 'name', label: 'Nome completo', divider: 'Dados pessoais', required: true, gridColumns: 5 },
    { property: 'email', label: 'E-mail', required: true, gridColumns: 5 },
    { property: 'status', type: 'boolean', booleanFalse: 'Inativo', booleanTrue: 'Ativo', required: true, gridColumns: 2 },
    { property: 'nickname', label: 'Apelido', optional: true, gridColumns: 3 },
    { property: 'birthdate', label: 'Nascimento', type: 'date', optional: true, gridColumns: 2 },
    { property: 'genre', label: 'Gênero', optional: true, gridColumns: 4, options: [
      { value: 'female', label: 'Feminino' },
      { value: 'male', label: 'Masculino' },
      { value: 'other', label: 'Outros' },
    ] },
    { property: 'nationality', label: 'Nacionalidade', optional: true, gridColumns: 3 },
    { property: 'street', label: 'Rua', divider: 'Endereço', required: true, gridColumns: 4 },
    { property: 'state', label: 'Estado', gridColumns: 2, optionsService: this.stateService, params: { transform: true } },
    { property: 'city', label: 'Cidade', required: true, gridColumns: 3, disabled: true },
    { property: 'country', label: 'País', optional: true, gridColumns: 3 },
    { property: 'mother', label: 'Nome da mãe', optional: true, divider: 'Filiação', gridColumns: 5 },
    { property: 'father', label: 'Nome do pai', optional: true, gridColumns: 5 },
  ];

  public creditos: any = { status: false };
  public state: string = '';

  constructor(
    private poNotification: PoNotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private httpClient: HttpClient) { }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();

    if (this.creditosSub) {
      this.creditosSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => {
      if (params['id']) {
        this.loadData(params['id']);
        this.action = actionUpdate;
      }
    });
  }

  validate(changeValue) {
    if (changeValue.property === 'state') {
      return {
        value: { city: undefined },
        fields: [
          {
            property: 'city',
            optionsService: changeValue.value.state === undefined ? undefined : this.cityService,
            params: { transform: true, uf: changeValue.value.state },
            disabled: changeValue.value.state === undefined
          }
        ],
        focus: 'city'
      };
    }
  }

  cancel() {
    this.router.navigateByUrl('/creditos');
  }

  save() {
    const creditos = {...this.creditos};

    creditos.status = creditos.status ? 'active' : 'inactive';

    this.creditosSub = this.isUpdateOperation
      ? this.httpClient.put(`${this.url}/${creditos.id}`, creditos)
        .subscribe(() => this.navigateToList('Cliente atualizado com sucesso'))
      : this.httpClient.post(this.url, creditos)
        .subscribe(() => this.navigateToList('Cliente cadastrado com sucesso'));
  }

  get isUpdateOperation() {
    return this.action === actionUpdate;
  }

  get title() {
    return this.isUpdateOperation ? '(D) Atualizando cliente' : '(D) Novo cliente';
  }

  private loadData(id) {
    this.creditosSub = this.httpClient.get(`${this.url}/${id}`)
      .pipe(
        map((creditos: any) => {
          creditos.status = creditos.status === 'active';
          this.state = creditos.uf;

          return creditos;
        })
      )
      .subscribe(response => this.creditos = response);
  }

  private navigateToList(msg: string) {
    this.poNotification.success(msg);

    this.router.navigateByUrl('/creditos');
  }

}
