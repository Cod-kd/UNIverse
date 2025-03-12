import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { PopupService } from '../popup-message/popup-message.service';

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
    params?: Record<string, string>
  } = {}): Observable<T> {
    const {
      responseType = 'json',
      showError = true,
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

    return this.http.get<T>(url, {
      responseType: responseType as any,
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, showError))
    );
  }

  post<T>(endpoint: string, body: any, options: {
    responseType?: 'json' | 'text',
    showError?: boolean,
  } = {}): Observable<T> {
    const {
      responseType = 'json',
      showError = true,
    } = options;

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      responseType: responseType as any,
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, showError))
    );
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