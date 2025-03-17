import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PopupService } from '../popup-message/popup-message.service';

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
    private popupService: PopupService
  ) { }

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
    authType?: AuthType
  } = {}): Observable<T> {
    const {
      responseType = 'json',
      showError = true,
      authType = AuthType.NONE
    } = options;

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      responseType: responseType as any,
      headers: this.getHeaders(authType)
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

  private handleError(error: HttpErrorResponse, showError = true): Observable<never> {
    if (!(error instanceof HttpErrorResponse)) {
      return throwError(() => error);
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