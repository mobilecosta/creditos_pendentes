import { Component, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { PoNotificationService, PoDynamicViewField } from '@portinari/portinari-ui';

@Component({
  selector: 'app-creditos-view',
  templateUrl: './creditos-view.component.html'
})
export class CreditosViewComponent implements OnDestroy, OnInit {

  private readonly url: string = 'https://app-demo-portinari-api.herokuapp.com/api/samples/v1/people';

  private creditosRemoveSub: Subscription;
  private creditosSub: Subscription;
  private paramsSub: Subscription;

  creditos: any = {};

  readonly fieldStatus = { property: 'statusDescription', label: 'Status', tag: true, gridColumns: 2, color: 'color-10' };

  readonly fields: Array<PoDynamicViewField> = [
    { property: 'name', label: 'Nome', divider: 'Dados pessoais', gridColumns: 5 },
    { property: 'email', label: 'E-mail', gridColumns: 5 },
    this.fieldStatus,
    { property: 'nickname', label: 'Apelido', gridColumns: 3 },
    { property: 'birthdate', label: 'Nascimento', type: 'date', format: 'dd/MM/yyyy', gridColumns: 3 },
    { property: 'genreDescription', label: 'Gênero', gridColumns: 3 },
    { property: 'nationality', label: 'Nacionalidade', gridColumns: 3 },
    { property: 'street', label: 'Rua', divider: 'Endereço', gridColumns: 6 },
    { property: 'cityName', label: 'Cidade', gridColumns: 3 },
    { property: 'country', label: 'País', gridColumns: 3 },
    { property: 'mother', label: 'Nome da mãe', divider: 'Filiação', gridColumns: 5 },
    { property: 'father', label: 'Nome do pai', gridColumns: 5 },
  ];

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService) { }

  ngOnInit() {
    this.paramsSub = this.route.params.subscribe(params => this.loadData(params['id']));
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.creditosSub.unsubscribe();

    if (this.creditosRemoveSub) {
      this.creditosRemoveSub.unsubscribe();
    }
  }

  back() {
    this.router.navigateByUrl('creditos');
  }

  edit() {
    this.router.navigateByUrl(`creditos/edit/${this.creditos.id}`);
  }

  remove() {
    this.creditosRemoveSub = this.httpClient.delete(`${this.url}/${this.creditos.id}`)
      .subscribe(() => {
        this.poNotification.warning('Cadastro do cliente apagado com sucesso.');

        this.back();
      });
  }

  private loadData(id) {
    this.creditosSub = this.httpClient.get(`${this.url}/${id}`)
      .subscribe(response => {
        this.creditos = response;

        this.fieldStatus.color = this.creditos.status === 'active' ? 'color-10' : 'color-07';
      });
  }

}
