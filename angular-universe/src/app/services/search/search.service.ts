import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { PopupService } from '../popup-message/popup-message.service';
import { Group } from '../../models/group/group.model';
import { Router, NavigationEnd } from '@angular/router';
import { Profile } from '../../models/profile/profile.model';
import { FetchService } from '../fetch/fetch.service';

export type SearchResult = Group[] | Profile | null;

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchedUsernameSubject = new BehaviorSubject<string>('');
  searchedUsername$ = this.searchedUsernameSubject.asObservable();

  private searchResultsSubject = new BehaviorSubject<SearchResult>(null);
  searchResults$ = this.searchResultsSubject.asObservable();

  constructor(
    private fetchService: FetchService,
    private popupService: PopupService,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/main-site/you') {
        const username = localStorage.getItem('username');
        if (username) {
          this.search(username).subscribe();
          this.searchedUsernameSubject.next(username);
        }
      }
    });
  }

  getEndpointByUrl(searchTerm: string | null = null): string {
    switch (this.router.url) {
      case "/main-site/profile":
      case "/main-site/you":
        return searchTerm ? `/user/name/${searchTerm}` : "/user/name/";
      case "/main-site/groups":
        return searchTerm ? `/groups/search` : "/groups/search";
      case "/main-site/events":
        return searchTerm ? `/events/search` : "/events/all";
      case "/main-site/calendar":
        return "/calendar/all";
      default:
        throw new Error("Unknown url");
    }
  }

  fetchAll(): Observable<Group[]> {
    try {
      const endpoint = this.getEndpointByUrl();
      
      // For groups search, we need an empty name param
      const params = this.router.url === "/main-site/groups" ? { name: '' } : undefined;
      
      return this.fetchService.get<Group[]>(endpoint, {
        responseType: 'json',
        params
      }).pipe(
        tap(results => this.searchResultsSubject.next(results))
      );
    } catch (error) {
      if (error instanceof Error) {
        this.popupService.show(error.message);
      }
      throw error;
    }
  }

  search(searchTerm: string): Observable<SearchResult> {
    if (this.router.url === "/main-site/profile" && !searchTerm.trim()) {
      throw new Error("Adj meg egy felhasználónevet!");
    }

    if (this.router.url === "/main-site/profile" || this.router.url === "/main-site/you") {
      this.searchedUsernameSubject.next(searchTerm.trim());
    }

    try {
      const endpoint = this.getEndpointByUrl(searchTerm);
      
      // Handle different parameter formats based on URL
      let params: Record<string, string> | undefined;
      if (this.router.url === "/main-site/groups" || this.router.url === "/main-site/events") {
        params = { name: searchTerm };
      }
      
      return this.fetchService.get<SearchResult>(endpoint, {
        responseType: 'json',
        params
      }).pipe(
        tap(results => this.searchResultsSubject.next(results))
      );
    } catch (error) {
      if (error instanceof Error) {
        this.popupService.show(error.message);
      }
      throw error;
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