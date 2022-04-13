import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data-service.service';
import { SharedDataService } from '../../services/shared-data.service';
import {
  PaymentRedirectReveniu,
  SignUpService,
  User,
} from '../../services/sign-up.service';

export interface PaymentResponse {
  completion_url: string;
  id: number;
  security_token: string;
  status_code: number;
}
@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  public loadingPayment = false;
  public userData: User;
  public plans = [];

  constructor(
    private dataService: DataService,
    private sharedService: SharedDataService,
    private signUpService: SignUpService
  ) {}

  ngOnInit(): void {
    this.userData = this.sharedService.user;
    this.dataService.getAllPlans().subscribe((res) => {
      this.plans = res.data.results;
    });
  }

  async pay(planId: string) {
    this.loadingPayment = true;
    const data = {
      user_id: this.userData.id,
      plan_id: planId,
      email: this.userData.email,
      name: this.userData.name,
    };
    await this.signUpService
      .createSuscription(data)
      .then((rpt: PaymentRedirectReveniu) => {
        this.openWindow(rpt.completion_url, rpt.security_token);
      })
      .catch((err) => {
        this.loadingPayment = false;
        console.log('Hubo un error');
      });
  }

  openWindow(url, hiddenInput) {
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = url;
    form.target = '_self';

    var input = document.createElement('input');
    input.id = 'TBK_TOKEN';
    input.name = 'TBK_TOKEN';
    input.type = 'hidden';
    input.value = hiddenInput;
    form.appendChild(input);
    document.body.appendChild(form);
    form.submit();
  }
}
