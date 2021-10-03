import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';
import { LayoutService } from '../layout.service';

@Injectable({
  providedIn: 'root'
})
export class ComplainService {

  constructor(private http: HttpClient, private layoutService: LayoutService) { }

  public getServiceProviderList(): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'service-provider/list';
    return this.http.get(url, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getCategoryByServiceProvider(serviceProviderId: number): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'category/list-by-service-provider';
    const params = new HttpParams()
      .set('serviceProviderId', serviceProviderId.toString());
    return this.http.get(url, { headers: header, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public addComplain(data: FormData): Observable<any> {
    const url = environment.api + 'complain';
    return this.http.post(url, data)
      .pipe(
        catchError(this.handleError)
      );
  }


  public getComplain(complainId: number): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'complain';

    let params = new HttpParams()
      .set('id', complainId.toString());

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
    const url = environment.api + 'complain/list';
    let params = new HttpParams()
      .set('pageNo', pageNo.toString())
      .set('pageSize', pageSize.toString())
      .set('orderBy', orderBy)
      .set('orderDirection', orderDirection);
    filter.forEach(el => {
      if (el.field === "date") {
        params = params.append('fromDate', this.layoutService.YYYYMMDD(el.from));
        params = params.append('toDate', this.layoutService.YYYYMMDD(el.to));
      } else {
        params = params.append(el.field, el.value);
      }
    });
    return this.http.get(url, { headers, params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public forward(complainId: number): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'complain/forward';
    return this.http.post(url, { complainId: complainId }, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public assign(complainId: number, assignTo: string): Observable<any> {
    const body = { complainId, assignTo };

    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'complain/assign';
    return this.http.post(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public followUp(complainId: number, remarks: string): Observable<any> {
    const body = { complainId, remarks }
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'complain/followup';
    return this.http.post(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  public action(complainId: number, remarks: string, email: string): Observable<any> {
    const body = { complainId, remarks, status: 4, email }
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'complain/followup';
    return this.http.post(url, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }


  public close(complainId: number, remarks: string): Observable<any> {
    const body = { complainId, remarks }
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + 'complain/close';
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
