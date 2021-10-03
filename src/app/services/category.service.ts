import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpHeaders, HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {


  constructor(private http: HttpClient) { }

  addCategory(category: string, serviceTypeId: string, isEnable: boolean): Observable<any> {
    const header = new HttpHeaders({ 'Content-Type': 'application/json' });
    const url = environment.api + 'category';
    return this.http.post(url, { category, serviceTypeId, isEnable }, { headers: header })
      .pipe(
        catchError(this.handleError))

  }
  public getCategory(id: number): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + `category`;
    const params = new HttpParams()
    .set('id', id.toString());
    return this.http.get(url, { params: params, headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }
   
  public editServiceProvider(id: string, category: string, serviceTypeId: string, isEnable: boolean): Observable<any> {
    const header = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + `category`;
    return this.http.put(url, {id, category, serviceTypeId, isEnable }, { headers: header })
      .pipe(
        catchError(this.handleError)
      );
  }

  public deleteCategory(id: number): Observable<any> {
    const headers = new HttpHeaders({ 'ContentType': 'application/json' });
    const url = environment.api + `category`;
    const params = new HttpParams()
    .set('id', id.toString());
    return this.http.delete(url,{ headers, params })
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
    const url = environment.api + 'category/list-details';
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
