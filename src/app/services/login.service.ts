import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { IRegister, IChangePassword, IForgotPassword, IResetPassword } from '../interfaces/complain';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  public login(email: string, password: string): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'login';
    return this.http.post(url, { email, password }, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public activateAccount(token: string, userId: string) : Observable<any>  {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const data = { token, userId };
    const url = environment.api + 'activate-account';
    return this.http.post(url, data, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public changePassword(data: IChangePassword): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'change-password';
    return this.http.post(url, data, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public register(data: IRegister): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'register';
    return this.http.post(url, data, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public forgotPassword(data: IForgotPassword): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': "application/json" });
    const url = `${environment.api}forgot-password`;

    return this.http.post(url, data, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }


  public passwordReset(data: IResetPassword, token: string, userId: string): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': "application/json" });
    const url = `${environment.api}reset-password`;
    const value: any = {
      password: data.newPassword,
      token,
      userId
    }
    return this.http.post(url, value, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error) {
      return throwError({ status: error.status, message: error.error.message });
    } else {
      return throwError({
        status: 500, success: false,
        message: `Backend returned code ${error.status} body was: ${error.message}`
      })
    }
  }
}
