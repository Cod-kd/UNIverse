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
      customErrorMessage,
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
      catchError((error: HttpErrorResponse) => this.handleError(error, showError, customErrorMessage))
    );
  }

  post<T>(endpoint: string, body: any, options: {
    responseType?: 'json' | 'text',
    showError?: boolean,
    customErrorMessage?: string
  } = {}): Observable<T> {
    const {
      responseType = 'json',
      showError = true,
      customErrorMessage
    } = options;

    return this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
      responseType: responseType as any,
    }).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error, showError, customErrorMessage))
    );
  }

  private handleError(error: HttpErrorResponse, showError = true, customErrorMessage?: string): Observable<never> {
    if (!(error instanceof HttpErrorResponse) || error.status >= 200 && error.status < 300) {
      return throwError(() => error);
    }

    // Use the actual error text from the server
    let errorMessage = error.error;

    if (showError && errorMessage) {
      this.popupService.showError(errorMessage);
    }

    return throwError(() => new Error(errorMessage));
  }
}