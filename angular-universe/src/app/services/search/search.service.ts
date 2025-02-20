import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PopupService } from '../popup-message/popup-message.service';
import { Group } from '../../models/group/group.model';
import { Router } from '@angular/router';
import { Profile } from '../../models/profile/profile.model';

export type SearchResult = Group[] | Profile | null;

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:8080';
  private readonly adminUsername = 'admin';
  private readonly adminPassword = 'oneOfMyBestPasswords';

  private searchResultsSubject = new BehaviorSubject<SearchResult>(null);
  searchResults$ = this.searchResultsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private popupService: PopupService,
    private router: Router
  ) {
    this.autoSearchIfOnYouPage();
  }

  private autoSearchIfOnYouPage(): void {
    if (this.router.url === '/main-site/you') {
      const username = localStorage.getItem('username');
      if (username) {
        this.search(username).subscribe();
      }
    }
  }

  getEndpointByUrl(searchTerm: string | null = null): string {
    switch (this.router.url) {
      case "/main-site/profile":
      case "/main-site/you":
        return searchTerm ? `/user/name/${searchTerm}` : "/user/name/";
      case "/main-site/groups":
        return searchTerm ? `/groups/search?name=${searchTerm}` : "/groups/search?name=";
      case "/main-site/events":
        return searchTerm ? `/events/search?name=${searchTerm}` : "/events/all";
      case "/main-site/calendar":
        return "/calendar/all";
      default:
        throw new Error("Unknown url");
    }
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(`${this.adminUsername}:${this.adminPassword}`),
      'Content-Type': 'application/json'
    });
  }

  fetchAll(): Observable<Group[]> {
    try {
      const endpoint = this.getEndpointByUrl();
      return this.http.get<Group[]>(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
        responseType: 'json'
      }).pipe(
        tap(results => this.searchResultsSubject.next(results)),
        catchError(() => {
          const errorMessage = "Szerveroldali hiba";
          this.popupService.show(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        this.popupService.show(error.message);
      }
      return throwError(() => new Error("Failed to fetch data"));
    }
  }

  search(searchTerm: string): Observable<SearchResult> {
    if (this.router.url === "/main-site/profile" && !searchTerm.trim()) {
      return throwError(() => new Error("Adj meg egy felhasználónevet!"));
    }

    try {
      const endpoint = this.getEndpointByUrl(searchTerm);
      return this.http.get<SearchResult>(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders(),
        responseType: 'json'
      }).pipe(
        tap(results => {
          console.log("Fetched search results:", results);
          this.searchResultsSubject.next(results);
        }),
        catchError(() => {
          const errorMessage = "Szerveroldali hiba";
          this.popupService.show(errorMessage);
          return throwError(() => new Error(errorMessage));
        })
      );
    } catch (error) {
      if (error instanceof Error) {
        this.popupService.show(error.message);
      }
      return throwError(() => new Error("Failed to fetch data"));
    }
  }

  handleSearchResponse(response: SearchResult) {
    this.searchResultsSubject.next(response);
    return response;
  }

  handleError(err: Error) {
    this.popupService.show(err.message);
  }
}