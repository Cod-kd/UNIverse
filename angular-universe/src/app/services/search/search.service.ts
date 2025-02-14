import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PopupService } from '../popup-message/popup-message.service';
import { Group } from '../../models/group/group.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private baseUrl = 'http://localhost:8080';
  private readonly adminUsername = 'admin';
  private readonly adminPassword = 'oneOfMyBestPasswords';

  private searchResultsSubject = new BehaviorSubject<Group[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private popupService: PopupService,
    private router: Router
  ) { }

  getFetchByUrl(): string {
    switch (this.router.url) {
      case "/main-site/profile":
        return "/user/name/";
      case "/main-site/groups":
        return "/groups/search?name=";
      case "/main-site/events":
        return "/events/search?name=";
      case "/main-site/calendar":
        return "/unknown";
      default:
        throw new Error("Unknown url");
    }
  }

  getBaseEndpointByUrl(): string {
    switch (this.router.url) {
      case "/main-site/profile":
        return "/user/name/";
      case "/main-site/groups":
        return "/groups/search?name=";
      case "/main-site/events":
        return "/events/all";
      case "/main-site/calendar":
        return "/calendar/all";
      default:
        throw new Error("Unknown url");
    }
  }

  fetchAll(): Observable<Group[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.adminUsername + ':' + this.adminPassword),
      'Content-Type': 'application/json'
    });

    try {
      const endpoint = this.getBaseEndpointByUrl();
      return this.http.get<Group[]>(`${this.baseUrl}${endpoint}`, {
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
    } catch (error) {
      if (error instanceof Error) {
        this.popupService.show(error.message);
      }
      return throwError(() => new Error("Failed to fetch data"));
    }
  }

  search(searchTerm: string): Observable<Group[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.adminUsername + ':' + this.adminPassword),
      'Content-Type': 'application/json'
    });

    try {
      const endpoint = this.getFetchByUrl();
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
    } catch (error) {
      if (error instanceof Error) {
        this.popupService.show(error.message);
      }
      return throwError(() => new Error("Failed to fetch data"));
    }
  }

  handleSearchResponse(response: Group[]) {
    this.searchResultsSubject.next(response);
    return response;
  }

  handleError(err: Error) {
    this.popupService.show(err.message);
  }
}