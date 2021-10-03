import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LayoutService } from 'src/app/layout.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IRegister } from 'src/app/interfaces/complain';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  @ViewChild('firstName', { static: true }) firstName: ElementRef;
  currentURL: any = 'assets/nta-logo.png';
  hidePassword = true;

  constructor(private layoutService: LayoutService,
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router) {

  }

  ngOnInit() {
    this.registerForm = new FormBuilder().group({
      firstName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      lastName: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      mobileNo: ['', Validators.compose([Validators.required, Validators.maxLength(20)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      captcha: ['', Validators.required]
    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Register Page' });
    this.firstName.nativeElement.focus();
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}`)
  }

  onSubmit({ value, valid }: { value: IRegister, valid: boolean }) {
    if (valid) {
      this.loginService.register(value).subscribe(x => {
        if (x.success) {
          const y = x.data;

          this.snackBar.open('Please verify your email.', null, { duration: 2000 });
          this.router.navigate(['login']);
        } else {
          this.snackBar.open(x.message, null, { duration: 2000 });
        }
      }, (err: any) => {
        this.snackBar.open(err.message, null, { duration: 2000 });
      });
    } else {
      this.firstName.nativeElement.focus();
      this.snackBar.open('Error! Inputs are incorrect or invalid!', null, { duration: 1000 });
    }
  }

}
