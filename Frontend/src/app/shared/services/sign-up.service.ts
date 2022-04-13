import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface User {
  id?: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  status?: 'ACTIVATE' | 'INACTIVATE';
}
export interface PaymentRedirectReveniu {
  completion_url: string,
  id: number,
  security_token: string,
  status_code: number
}

export interface PaymentData {
  user_id: number;
  plan_id: string;
  email: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  constructor(private http: HttpClient) {}

  public async createUser(user: User) {
    return await this.http
      .post<User>(environment.API + 'create-user', user)
      .toPromise();
  }

  public async createSuscription(user: PaymentData) {
    return await this.http
      .post<PaymentRedirectReveniu>(environment.API + 'createSuscription/', user)
      .toPromise();
  }
}
