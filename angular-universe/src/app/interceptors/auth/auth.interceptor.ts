import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.startsWith(environment.apiUrl)) {
      // Skip auth for login endpoint
      if (request.url.includes('/auth/login')) {
        return next.handle(request.clone({
          setHeaders: {
            'Content-Type': 'application/json'
          }
        }));
      }

      // Add JWT token for other API requests
      const token = this.authService.getToken();
      if (token) {
        const authReq = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        return next.handle(authReq);
      }
    }

    return next.handle(request);
  }
}