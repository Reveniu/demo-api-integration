import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TableComponent } from './shared/component/table/table.component';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DataService } from './shared/services/data-service.service';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { SignUpComponent } from './shared/component/sign-up/sign-up.component';
import { PaymentComponent } from './shared/component/payment/payment.component';
import { SuccessComponent } from './shared/component/success/success.component';
import { FailComponent } from './shared/component/fail/fail.component';
import { PrimeModule } from './prime/prime.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionDetailComponent } from './shared/component/subscription-detail/subscription-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    SignUpComponent,
    PaymentComponent,
    SuccessComponent,
    FailComponent,
    SubscriptionDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    PrimeModule,
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
