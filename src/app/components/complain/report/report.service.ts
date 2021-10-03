import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  YYYYMMDD = (date: Date) => {
    let x = new Date(date);
    let y = x.getFullYear().toString();
    let m = (x.getMonth() + 1).toString();
    let d = x.getDate().toString();
    (d.length === 1) && (d = "0" + d);
    (m.length === 1) && (m = "0" + m);
    let yyyymmdd = `${y}-${m}-${d}`;
    return yyyymmdd;
  }

  constructor(private http: HttpClient) { }

  public getSummary(
    fromDate: Date,
    toDate: Date,
  ): Observable<any> {

    const params = new HttpParams()
      .set('fromDate', this.YYYYMMDD(fromDate))
      .set('toDate', this.YYYYMMDD(toDate))

    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/summary';

    return this.http.get(url, { headers: header, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getCategory(fromDate: Date, toDate: Date): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/count-category';
    const params = new HttpParams()
      .set('fromDate', this.YYYYMMDD(fromDate))
      .set('toDate', this.YYYYMMDD(toDate))
    return this.http.get(url, { headers: header, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getServiceProvider(fromDate: Date, toDate: Date): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/count-service-provider';
    const params = new HttpParams()
      .set('fromDate', this.YYYYMMDD(fromDate))
      .set('toDate', this.YYYYMMDD(toDate))
    return this.http.get(url, { headers: header, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getPendingComplain(): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/pending-complain';
    return this.http.get(url, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getPendingComplainFromForwarded() {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/pending-complain-from-forwarded';

    return this.http.get(url, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getResolvedComplain(fromDate: Date, toDate: Date) {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/resolved-complain';
    const params = new HttpParams()
      .set('fromDate', this.YYYYMMDD(fromDate))
      .set('toDate', this.YYYYMMDD(toDate))
    return this.http.get(url, { headers: header, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  public getmonthlyComplain(year: number, month: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'report/monthly-complain';
    const params = new HttpParams()
      .set('year', year.toString())
      .set('month', month.toString())
    return this.http.get(url, { headers: headers, params: params })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    console.log(error)
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
}
