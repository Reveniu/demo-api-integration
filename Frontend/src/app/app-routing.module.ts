import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FailComponent } from './shared/component/fail/fail.component';
import { PaymentComponent } from './shared/component/payment/payment.component';
import { SignUpComponent } from './shared/component/sign-up/sign-up.component';
import { SubscriptionDetailComponent } from './shared/component/subscription-detail/subscription-detail.component';
import { SuccessComponent } from './shared/component/success/success.component';
import { TableComponent } from './shared/component/table/table.component';


const routes: Routes = [
  {
    path: 'list',
    component: TableComponent
  },
  {
    path: '',
    component: SignUpComponent
  },
  {
    path: 'login',
    component: SignUpComponent
  },
  {
    path:'payment',
    component: PaymentComponent
  },
  {
    path: 'success-payment',
    component: SuccessComponent
  },
  {
    path: 'fail-payment',
    component: FailComponent
  },
  {
    path: 'payment-table',
    component: TableComponent
  },
  {
    path: 'subscription-detail/:idsub',
    component: SubscriptionDetailComponent
  },
  {
    path: 'subscription-detail',
    component: SubscriptionDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
