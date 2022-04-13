import { Injectable } from '@angular/core';
import { User } from './sign-up.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  public user:User;
  constructor() { }
}
