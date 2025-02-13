import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PopupService } from './popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:8080';
  private readonly adminUsername = 'admin';
  private readonly adminPassword = 'oneOfMyBestPasswords';

  constructor(
    private http: HttpClient,
    private popupService: PopupService
  ) { }

  search(endpoint: string, searchTerm: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.adminUsername + ':' + this.adminPassword),
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.baseUrl}${endpoint}${searchTerm}`, {
      headers,
      responseType: 'json'
    }).pipe(
      catchError(err => {
        this.popupService.show(err);
        return throwError(() => new Error(err));
      })
    );
  }

  handleSearchResponse(response: any) {
    console.log('Search results:', response);
    return response;
  }

  handleError(err: any) {
    this.popupService.show(err.message);
  }
}