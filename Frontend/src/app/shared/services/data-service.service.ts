import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

export interface Country {
  name?: string;
  code?: string;
}

export interface Representative {
  name?: string;
  image?: string;
}

export interface Customer {
  id?: number;
  name?: string;
  country?: Country;
  company?: string;
  date?: string | Date;
  status?: string;
  activity?: number;
  representative?: Representative;
  verified?: boolean;
  balance?: boolean;
}

export interface SubscriptionInterface {
  id: number;
  subscription_id: number;
  user_id: number;
  status: string;
}

export interface SubscriptionReveniu {
  id: number;
  interval: string;
  status: string;
  cicles: number;
  remaining_cicles: number;
  link_title: string;
  link_description: string;
  plan_amount: number;
  is_uf: boolean;
  plan_id: number;
  is_auto_renew: boolean;
  discount_rate: number;
  discount_is_fixed: boolean;
  discount_cicles: number;
  customer: {
    id: number;
    email: string;
    name: string;
  };
  last_payment: {
    date: string;
    status: string;
  };
}

export interface allSubsResponse {
  data: SubscriptionInterface[];
}

@Injectable()
export class DataService {
  constructor(private http: HttpClient) {}

  public getAllPlans() {
    return this.http.get<any>(environment.API + 'findAllPlans');
  }

  public getAllSubs() {
    return this.http
      .get<allSubsResponse>(environment.API + 'getSubs')
      .toPromise();
  }

  public getSubPayments(subId: number) {
    return this.http
      .get<any>(`${environment.API}getSubPayments/${subId}`);
  }

  public disableSubscription(subId: number) {
    return this.http
      .post<any>(`${environment.API}disableSub/${subId}`, {});
  }

  public enableSubscription(subId: number) {
    return this.http
      .post<any>(`${environment.API}enableSub/${subId}`, {});
  }

  public getSubByEmail(email: string) {
    return this.http
      .get<any>(`${environment.API}getSubByEmail?email=${email}`).toPromise();
  }

  public getOneSubInfo(subId: number) {
    return this.http
      .get<any>(`${environment.API}getSub/${subId}`)
      .toPromise();
  }
}
