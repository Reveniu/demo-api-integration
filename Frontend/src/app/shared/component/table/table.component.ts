import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import {
  DataService,
  SubscriptionInterface,
  SubscriptionReveniu,
} from '../../services/data-service.service';
import { ExportService } from '../../services/export-csv.service';
import { status_transaction } from './status-data';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  loading: boolean = true;

  activityValues: number[] = [0, 100];
  public status_data = status_transaction;
  allSubsIds: SubscriptionInterface[] = [];
  allSubs = [];
  searchEmailText = '';

  constructor(
    private customerService: DataService,
    private exportService: ExportService,
    private router: Router
  ) {}

  private async requestDataForEachSub() {
    const newSubs = [];
    for (let index = 18; index > 13; index--) {
      //this.allSubsIds.length
      const element = this.allSubsIds[index];
      await this.customerService
        .getOneSubInfo(element.id)
        .then((result) => {
          result['last_payment_date'] = undefined;
          if (result.last_payment.date)
            result['last_payment_date'] = new Date(result.last_payment.date);
          newSubs.push(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
    this.allSubs = newSubs;
    this.loading = false;
    console.log('All subs from reveniu', this.allSubs);
  }

  async ngOnInit() {
    await this.getDataFromSubs();
  }

  exportData() {
    const exportFile = [];
    this.allSubs.map((elem) => {
      exportFile.push({
        Nombre: elem.customer.name,
        Correo: elem.customer.email,
        Título: elem.link_title,
        Precio: elem.plan_amount,
        Ciclos: elem.cicles,
        'Ciclos Restantes': elem.remaining_cicles,
        'Último pago': elem.last_payment.date,
        Estatus: elem.last_payment.status,
      });
    });

    this.exportService.downloadFile(exportFile, 'stats.csv');
  }

  clear(table: Table) {
    table.clear();
  }

  goToDetail(id_sub: number) {
    console.log('Go to detail of ' + id_sub);
    this.router.navigate(['/subscription-detail'], {
      queryParams: { idsub: id_sub },
    });
  }

  public async getDataFromSubs() {
    await this.customerService.getAllSubs().then((subcriptions) => {
      this.allSubsIds = subcriptions.data;
      this.requestDataForEachSub();
    });
  }

  public async searchEmail() {
    if (this.searchEmailText !== '') {
      this.loading = true;
      try {
        await this.customerService
          .getSubByEmail(this.searchEmailText)
          .then((res) => {
            this.allSubs = res;
            this.loading = false;
          });
      } catch (error) {
        this.loading = false;
      }
    } else {
      await this.getDataFromSubs();
    }
  }
}
