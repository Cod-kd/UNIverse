import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Apply the headers only to our API requests
    if (request.url.startsWith(environment.apiUrl)) {
      const authReq = request.clone({
        setHeaders: {
          'Authorization': 'Basic ' + btoa(`${environment.auth.adminUsername}:${environment.auth.adminPassword}`),
          'Content-Type': 'application/json'
        }
      });
      return next.handle(authReq);
    }
    
    // For other requests, pass through unchanged
    return next.handle(request);
  }
}