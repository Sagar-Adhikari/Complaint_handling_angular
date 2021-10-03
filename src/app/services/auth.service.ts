import { Injectable, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as jwt_decode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _roleId: number = 0;
  private _serviceProviderId: number = 0;
  private currentUser = new BehaviorSubject<any>('');
  @Input() get roleId() {
    return this._roleId;
  } set roleId(val: number) {
    this._roleId = val;
  }

  @Input() get serviceProviderId() {
    return this._serviceProviderId;
  } set serviceProviderId(val: number) {
    this._serviceProviderId = val;
  }

  currentUser$ = this.currentUser.asObservable();

  constructor() {
    const storedUser: any = localStorage.getItem('ni-user') || null;

    if (storedUser) {
      const usrObject = JSON.parse(storedUser);
      this.roleId = usrObject.roleId;
      this.serviceProviderId = usrObject.serviceProviderId;
    }
  }

  public setToken(jwt: string, refreshJwt: string, user: any) {
    localStorage.setItem('ni-token', jwt);
    localStorage.setItem('ni-refresh-token', refreshJwt);
    localStorage.setItem('ni-user', JSON.stringify(user));

    // const usrObject = JSON.parse(user);
    this.roleId = user.roleId;
    this.serviceProviderId = user.serviceProviderId;

    this.changeUser();
  }

  public getToken() {
    const jwt: string = localStorage.getItem('ni-token') || '';
    const rJwt: string = localStorage.getItem('ni-refresh-token') || '';
    return ({ token: jwt, refreshToken: rJwt });
  }
  public clearToken() {
    localStorage.removeItem('ni-token');
    localStorage.removeItem('ni-refresh-token');
    localStorage.removeItem('ni-user');
    this.roleId =0;
    this.serviceProviderId = 0;
    this.changeUser();
  }

  isLoggedIn() {
    let result = false;
    const token = localStorage.getItem('ni-refresh-token') || null;
    if (token) {
      const decode = jwt_decode(token);
      const currentTime = new Date().getTime() / 1000;
      if (currentTime < decode.exp) {
        result = true;
      } else {
        this.clearToken();
      }
    }
    return result;
  }

  changeUser() {
    if (this.isLoggedIn()) {
      const storedUser = localStorage.getItem('ni-user') || null;
      const user: any = JSON.parse(storedUser) || null;
      this.currentUser.next(user);
    } else {
      this.roleId = 0;
      this.serviceProviderId = 0;
      this.currentUser.next(null);
    }
  }
}
