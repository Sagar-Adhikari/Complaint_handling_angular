import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, ) { }

  public getUser(email?: string, id?: string): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'user';
    let params = new HttpParams();
    if (email) {
      params = params.append("email", email);
    } else {
      params = params.append("id", id);
    }
    return this.http.get(url, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }
  public getList(
    pageNo: number,
    pageSize: number,
    orderBy: string,
    orderDirection: string,
    filter: any[]
  ): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'user/list';
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('orderBy', orderBy)
      .set('orderDirection', orderDirection);
    filter.forEach(el => {
      params = params.append(el.field, el.value);
    });
    return this.http.get(url, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public setNTAAdminRole(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'role/nta-admin';
    let body = { userId: userId };

    return this.http.post(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public setNTAUserRole(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'role/nta-user';
    let body = { userId: userId };

    return this.http.post(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public setServiceProviderAdminRole(userId: string, serviceProviderId: number): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'role/service-provider-admin';
    let body = { userId: userId, serviceProviderId };

    return this.http.post(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public setServiceProviderUserRole(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'role/service-provider-user';
    let body = { userId: userId };

    return this.http.post(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public resetRole(userId: string): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'role/reset';
    let body = { userId: userId };

    return this.http.post(url, body, { headers })
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
