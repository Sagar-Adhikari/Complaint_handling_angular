import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { LayoutService } from 'src/app/layout.service';
import { Router, ActivatedRoute } from '@angular/router';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  congratulation: string;
  private userId: string;
  private token: string;

  @ViewChild('userName', { static: true }) userEmail: ElementRef;

  currentURL: any = 'assets/nta-logo.png';
  hidePassword = true;
  redirectURL: string;

  constructor(private loginService: LoginService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private layoutService: LayoutService,
    private router: Router) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.redirectURL = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('userId');
    this.token = this.route.snapshot.paramMap.get('token');
    if (this.userId && this.token) {
      this.loginService.activateAccount(this.token, this.userId).subscribe(x => {
        if (x.success) {
          this.congratulation = x.message;
        } else {
          this.layoutService.showMessageError(x.message, 5000);
        }
      }, (err: any) => {
        this.layoutService.showMessageError(err.message, 5000);
      });
    }

    this.loginForm = new FormBuilder().group({
      email: ['', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])]
    });
    this.layoutService.setLayout({ allowFooter: true, pageTitle: 'Login Page' });
    this.userEmail.nativeElement.focus();
    this.layoutService.setLoading(false);
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }) {
    if (valid) {
      this.layoutService.setLoading(true);
      this.loginService.login(value.email, value.password).subscribe(x => {
        if (x.success) {
          const y = x.data;
          this.authService.setToken(y.token, y.refreshToken, y.user);
          this.layoutService.showMessageInfo('Welcome to Complaint Handling System - NTA.');
          if (this.redirectURL) {
            this.router.navigate([this.redirectURL]);
          } else {
            this.router.navigate(['my-complain']);
          }
        } else {
          this.layoutService.showMessageError(x.message);
        }
      }, (err: any) => {
        this.layoutService.showMessageError(err.message);
      });
    } else {
      this.userEmail.nativeElement.focus();
      this.layoutService.showMessageInfo('Oops! Inputs are incorrect or invalid!');
    }
  }
}
