import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service';
import { SignUpService, User } from '../../services/sign-up.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
})
export class SignUpComponent implements OnInit {
  profileForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  public toData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  public creationInProgress = false;
  constructor(
    private signUpService: SignUpService,
    private router: Router,
    private sharedService: SharedDataService
  ) {}

  ngOnInit(): void {}

  async registrarse() {
    if (this.profileForm.invalid) return;
    try {
      this.creationInProgress = true;
      await this.signUpService
        .createUser(this.profileForm.value)
        .then((resp: User) => {
          this.sharedService.user = resp;
          this.router.navigate(['/payment']);
        });
    } catch (error) {
      this.creationInProgress = false;
    }
  }
}
