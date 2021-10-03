import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import { LayoutService } from '../layout.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private authService: AuthService,
    private router: Router,
    private layoutService: LayoutService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkedLoggedIn(state.url, route.data);
  }

  checkedLoggedIn(url: string, data: any) {
    const isLoggedIn = this.authService.isLoggedIn();
    const roleId = this.authService.roleId;


    if (isLoggedIn) {
      if (url === '/login' || url ==='/' || url ==='/register' || url==='/forgot-password') {
        this.router.navigate(['/my-complain']);
        return false;
      }
      if (data.roleId) {
        if (data.roleId.indexOf(roleId) >= 0) {
          return true;
        } else {
          this.router.navigate(['/my-complain']);
          this.layoutService.showMessageInfo(`You are not authorized to access url : [${url}]`);
          return true;
        }
      } else {
        return true;
      }
    } else {
      if (url === '/login' || url ==='/' || url ==='/register' || url==='/forgot-password') {
        return true;
      } else {
        this.router.navigate(['/login'], { state: { url: url } });
        return false;
      }

    }
  }
}
