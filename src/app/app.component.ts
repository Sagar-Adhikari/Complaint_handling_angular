import { Component } from '@angular/core';
import { LayoutService } from './layout.service';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AuthService } from './services/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { fader, slider } from './animation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [fader]
})
export class AppComponent {
  private _roleId: number = 0;
  private _email: string = '?';
  private _serviceProviderId: number = 0;

  loading = false;
  title = 'nta-client';
  pageTitle = 'Initial Title';
  allowFooter = true;
  smallScreen = false;
  isLoggedIn = false;

  get roleId(): number {
    return this._roleId;
  }
  get email(): string {
    return this._email;
  }
  get serviceProviderId(): number {
    return this._serviceProviderId;
  }

  constructor(private layoutService: LayoutService,
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router) {

    this.layoutService.pageTitle$.subscribe(x => {
      this.pageTitle = x.pageTitle;
      this.allowFooter = x.allowFooter;
    });

    this.authService.currentUser$.subscribe(x => {
      if (x) {
        this.isLoggedIn = true;
        this._roleId = x.roleId;
        this._email = x.email;
        this._serviceProviderId = x.serviceProviderId;
      } else {
        this._roleId = 0;
        this._email = '';
        this._serviceProviderId = 0;
        this.isLoggedIn = false;
      }
    });

    this.layoutService.loading$.subscribe(x => {
      this.loading = x;
    })


    this.breakpointObserver.observe([
      '(max-width: 768px)'
    ]).subscribe(result => {
      if (result.matches) {
        this.smallScreen = true;
      } else {
        this.smallScreen = false;
      }
    });
    this.authService.changeUser();
  }

  login() {
    this.router.navigate(['login']);
  }
  logout() {
    this.authService.clearToken();
    this.router.navigate(['login'])
    this.layoutService.showMessageInfo("Successfully logged out.", 200000);
  }

  menuClicked(url: string, drawer: any) {
    if (!this.router.isActive(url, true)) {
      this.layoutService.setLoading(true);
      this.router.navigate([url]);
      if(this.smallScreen){
        drawer.toggle();
      }
    }
  }
  changePassword() {
    this.router.navigate(['change-password'])
  }

  animation(flag: string, $event: any) {
    console.log(flag, $event);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
