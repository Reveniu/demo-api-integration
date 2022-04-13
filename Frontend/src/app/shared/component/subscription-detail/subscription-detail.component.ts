import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DataService } from '../../services/data-service.service';

@Component({
  selector: 'app-subscription-detail',
  templateUrl: './subscription-detail.component.html',
  styleUrls: ['./subscription-detail.component.css'],
})
export class SubscriptionDetailComponent implements OnInit {
  public loadingData = true;
  public subscription_info = undefined;
  items: MenuItem[];
  public select_sub = undefined;
  displayedColumns: string[] = [
    'issued_on',
    'amount',
    'buy_order',
    'credit_card_type',
    'is_recurrent',
  ];
  dataSource = new MatTableDataSource();

  constructor(
    private customerService: DataService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.select_sub = +params['idsub'] || 0;
    });
    this.items = [
      {
        label: 'Tabla de suscripciones',
        icon: 'pi pi-fw pi-table',
        command: () => this.goTo('payment-table'),
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-user',
        items: [
          {
            label: 'Nuevo',
            icon: 'pi pi-fw pi-user-plus',
            command: () => this.goTo('login'),
          },
          {
            label: 'Delete',
            icon: 'pi pi-fw pi-user-minus',
          },
          {
            label: 'Search',
            icon: 'pi pi-fw pi-users',
          },
        ],
      },
      {
        label: 'Salir',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.closeWindows(),
      },
    ];
    await this.customerService
      .getOneSubInfo(this.select_sub)
      .then((response) => {
        console.log('Sub response', response);
        this.subscription_info = response;
      })
      .catch((error) => {
        console.log(error);
      });
    this.customerService.getSubPayments(this.select_sub).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.payments);
    });
    this.loadingData = false;
  }

  private goTo(path: string) {
    this.router.navigate([path]);
  }

  public async disableSub() {
    await this.customerService.disableSubscription(this.select_sub).toPromise();
  }

  public async enableSub() {
    await this.customerService.enableSubscription(this.select_sub).toPromise();
  }

  private closeWindows() {
    console.log('Si entre');
    var win = window.open('about:blank', '_self');
    win.close();
  }
}
