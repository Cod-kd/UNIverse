import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PopupService } from './popup-message.service';
import { Group } from '../models/group/group.model';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:8080';
  private readonly adminUsername = 'admin';
  private readonly adminPassword = 'oneOfMyBestPasswords';

  // Add the BehaviorSubject for search results
  private searchResultsSubject = new BehaviorSubject<Group[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private popupService: PopupService
  ) { }

  search(endpoint: string, searchTerm: string): Observable<Group[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.adminUsername + ':' + this.adminPassword),
      'Content-Type': 'application/json'
    });

    return this.http.get<Group[]>(`${this.baseUrl}${endpoint}${searchTerm}`, {
      headers,
      responseType: 'json'
    }).pipe(
      tap(results => this.searchResultsSubject.next(results)),
      catchError(() => {
        let errorMessage = "Szerveroldali hiba";
        this.popupService.show(errorMessage);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  handleSearchResponse(response: Group[]) {
    console.log('Search results:', response);
    this.searchResultsSubject.next(response);
    return response;
  }

  handleError(err: Error) {
    this.popupService.show(err.message);
  }
}