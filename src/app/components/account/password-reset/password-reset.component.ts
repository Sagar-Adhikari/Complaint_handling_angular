import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LayoutService } from 'src/app/layout.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IResetPassword } from 'src/app/interfaces/complain';
import { LoginService } from 'src/app/services/login.service';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent implements OnInit {
  @ViewChild('newPassword', { static: true }) newPassword: ElementRef;
  passwordResetForm: FormGroup;
  private token: string;
  private userId: string;
  hidePassword = true;

  constructor(
    private layoutService: LayoutService,
    private loginService: LoginService,
    private router: Router,
    private route: ActivatedRoute, ) { }

  ngOnInit() {
    this.passwordResetForm = new FormBuilder().group({
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])]
    });

    this.userId = this.route.snapshot.paramMap.get('userId');
    this.token = this.route.snapshot.paramMap.get('token');
    this.newPassword.nativeElement.focus();
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Password Reset Page' });
    this.layoutService.setLoading(false);
  }

  onSubmit({ value, valid }: { value: IResetPassword, valid: boolean }) {
    if (valid) {
      this.layoutService.setLoading(true);
      this.loginService.passwordReset(value, this.token, this.userId).subscribe(x => {
        if (x.success) {
          this.layoutService.showMessageSuccess('Password reset successfully. Please login with your new password.');
          this.router.navigate(['login']);
        } else {
          this.layoutService.showMessageError(x.message);
        }
      }, (err: any) => {
        this.layoutService.showMessageError(err.message);
      });
    } else {
      this.newPassword.nativeElement.focus();
      this.layoutService.showMessageInfo('Error! Inputs are incorrect or invalid!');
    }
  }

}
