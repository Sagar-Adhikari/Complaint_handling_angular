import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout.service';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IChangePassword } from 'src/app/interfaces/complain';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  @ViewChild('oldPassword', { static: true }) oldPassword: ElementRef;

  hideOldPassword = true;
  hideNewPassword = true;

  constructor(private layoutService: LayoutService,
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit() {
    this.changePasswordForm = new FormBuilder().group({
      oldPassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      newPassword: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])]
    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Change Password' });
    this.oldPassword.nativeElement.focus();
    this.layoutService.setLoading(false);
  }

  onSubmit({ value, valid }: { value: IChangePassword, valid: boolean }) {
    if (valid) {
      this.layoutService.setLoading(true);
      this.loginService.changePassword(value).subscribe(x => {
        if (x.success) {
          this.layoutService.showMessageSuccess(x.message);
          this.authService.clearToken();
          this.router.navigate(['login']);
        } else {
          this.layoutService.showMessageError (x.message);
        }
      }, (err: any) => {
        this.layoutService.showMessageError(err.message);
      });
    } else {
      this.oldPassword.nativeElement.focus();
      this.layoutService.showMessageInfo('Error! Inputs are incorrect or invalid!');
    }
  }
}
