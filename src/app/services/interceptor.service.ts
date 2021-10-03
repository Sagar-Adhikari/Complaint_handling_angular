import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    
    if (req.url.startsWith('https://ipapi.co/json')) {
      return next.handle(req);
    }


    const httpRequest = req.clone({
      headers: new HttpHeaders({
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'x-token': localStorage.getItem('ni-token') || '',
        'x-refresh-token': localStorage.getItem('ni-refresh-token') || ''
      })

      
    });
  
    return next.handle(httpRequest);
  }
}
