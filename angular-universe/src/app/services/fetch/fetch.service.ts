import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PopupService } from '../popup-message/popup-message.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

export enum AuthType {
  NONE = 'none',
  JWT = 'jwt'
}

@Injectable({
  providedIn: 'root'
})
export class FetchService {
  private baseUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private popupService: PopupService,
    private authService: AuthService,
    private router: Router
  ) { }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  get<T>(endpoint: string, options: {
    responseType?: 'json' | 'text',
    showError?: boolean,
    customErrorMessage?: string,
    params?: Record<string, string>,
    authType?: AuthType
  } = {}): Observable<T> {
    const {
      responseType = 'json',
      showError = true,
      params,
      authType = AuthType.NONE
    } = options;

    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      url += `?${queryParams.toString()}`;
    }

    return this.http.get<T>(url, {
      responseType: responseType as any,
      headers: this.getHeaders(authType)
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, showError))
    );
  }

  post<T>(endpoint: string, body: any, options: {
    responseType?: 'json' | 'text',
    showError?: boolean,
    authType?: AuthType,
    params?: Record<string, string>
  } = {}): Observable<T> {
    const {
      responseType = 'json',
      showError = true,
      authType = AuthType.NONE,
      params
    } = options;

    let url = `${this.baseUrl}${endpoint}`;

    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        queryParams.append(key, value);
      });
      url += `?${queryParams.toString()}`;
    }

    return this.http.post<T>(url, body, {
      responseType: responseType as any,
      headers: this.getHeaders(authType)
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, showError))
    );
  }

  // Rest of the FetchService code remains the same
  // New method for handling FormData (no Content-Type header)
  postFormData<T>(endpoint: string, formData: FormData, options: {
    responseType?: 'json' | 'text',
    showError?: boolean,
    authType?: AuthType
  } = {}): Observable<T> {
    const {
      responseType = 'json',
      showError = true,
      authType = AuthType.NONE
    } = options;

    // Get headers without Content-Type since browser sets it with boundary for FormData
    const headers = this.getHeadersForFormData(authType);

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, formData, {
      responseType: responseType as any,
      headers
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, showError))
    );
  }

  private getHeaders(authType: AuthType): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    switch (authType) {
      case AuthType.JWT:
        const token = localStorage.getItem('token');
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        break;
    }

    return headers;
  }

  // FormData-specific headers (no Content-Type)
  private getHeadersForFormData(authType: AuthType): HttpHeaders {
    let headers = new HttpHeaders();

    switch (authType) {
      case AuthType.JWT:
        const token = localStorage.getItem('token');
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
        break;
    }

    return headers;
  }

  private handleError(error: HttpErrorResponse, showError = true): Observable<never> {
    if (!(error instanceof HttpErrorResponse)) {
      return throwError(() => error);
    }

    // Handle authentication errors 
    if (error.status === 401 || error.status === 403) {
      this.authService.logout();
      this.router.navigate(['/UNIcard-login']);
      if (showError) {
        this.popupService.showError('Bejelentkezés lejárt vagy érvénytelen');
      }
      return throwError(() => new Error('Authentication error'));
    }

    if (error.status >= 200 && error.status < 300) {
      return throwError(() => error);
    }

    let errorMessage: string;
    if (typeof error.error === 'string') {
      errorMessage = error.error;
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else {
      errorMessage = error.message || 'Ismeretlen hiba';
    }

    if (showError && errorMessage) {
      this.popupService.showError(errorMessage);
    }

    return throwError(() => new Error(errorMessage));
  }
}