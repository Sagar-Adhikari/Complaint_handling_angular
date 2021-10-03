import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout.service';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { IForgotPassword } from 'src/app/interfaces/complain';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  @ViewChild('email', { static: true }) email: ElementRef;

  constructor(private layoutService: LayoutService,
    private loginService: LoginService,
    private router: Router) { }

  ngOnInit() {
    this.forgotPasswordForm = new FormBuilder().group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      captcha: ['', Validators.required]
    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Forgot Password' });
    this.email.nativeElement.focus();
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response ${captchaResponse}`)
  }
  onSubmit({ value, valid }: { value: IForgotPassword, valid: boolean }) {
    if (valid) {
      this.layoutService.setLoading(true);
      this.loginService.forgotPassword(value).subscribe(x => {
        if (x.success) {
          this.layoutService.showMessageSuccess('Password reset link has been sent to your email, please follow the instruction.');
          this.router.navigate(['login']);
        } else {
          this.layoutService.showMessageError(x.message);
        }
      }, (err: any) => {
        this.layoutService.showMessageError(err.message);
      });
    } else {
      this.email.nativeElement.focus();
      this.layoutService.showMessageInfo('Error! Inputs are incorrect or invalid!');
    }
  }
}
