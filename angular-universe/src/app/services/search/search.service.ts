import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { PopupService } from '../popup-message/popup-message.service';
import { LoadingService } from '../loading/loading.service';
import { Group } from '../../models/group/group.model';
import { Router, NavigationEnd } from '@angular/router';
import { Profile } from '../../models/profile/profile.model';
import { FetchService } from '../fetch/fetch.service';
import { GroupService } from '../group/group.service';

export type SearchResult = Group[] | Profile | Profile[] | null;

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchedUsernameSubject = new BehaviorSubject<string>('');
  searchedUsername$ = this.searchedUsernameSubject.asObservable();

  private searchResultsSubject = new BehaviorSubject<SearchResult>(null);
  searchResults$ = this.searchResultsSubject.asObservable();

  private matchedProfilesSubject = new BehaviorSubject<Profile[]>([]);
  matchedProfiles$ = this.matchedProfilesSubject.asObservable();

  private errorShown = false;

  constructor(
    private fetchService: FetchService,
    private groupService: GroupService,
    private popupService: PopupService,
    private router: Router,
    private loadingService: LoadingService,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === '/main-site/user-profile') {
          this.searchResultsSubject.next(null);
          this.matchedProfilesSubject.next([]);
          this.searchedUsernameSubject.next('');
        }

        if (event.url === '/main-site/you') {
          const username = localStorage.getItem('username');
          if (username) {
            this.search(username).subscribe();
            this.searchedUsernameSubject.next(username);
          }
        }
      }
    });
  }

  getEndpointByUrl(searchTerm: string | null = null, isProfessionalSearch: boolean = false): string {
    switch (this.router.url) {
      case "/main-site/user-profile":
      case "/main-site/you":
        if (isProfessionalSearch) {
          return "/user/all";
        }
        return searchTerm ? `/user/name/${searchTerm}` : "/user/name/";
      case "/main-site/groups":
        return `/groups/search`;
      case "/main-site/events":
        return searchTerm ? `/events/search` : "/events/all";
      default:
        throw new Error("Unknown url");
    }
  }

  search(searchTerm: string, isProfessionalSearch: boolean = false): Observable<SearchResult> {
    this.loadingService.show();
    this.errorShown = false;

    this.matchedProfilesSubject.next([]);

    if (this.router.url === "/main-site/user-profile" && !searchTerm.trim() && !isProfessionalSearch) {
      this.loadingService.hide();
      throw new Error("Adj meg egy felhasználónevet!");
    }

    if (this.router.url === "/main-site/user-profile" && searchTerm.trim() === localStorage.getItem("username") && !isProfessionalSearch) {
      this.router.navigate(["/main-site/you"]);
      return new Observable<SearchResult>(observer => {
        observer.next(null);
        observer.complete();
      });
    }

    if ((this.router.url === "/main-site/user-profile" || this.router.url === "/main-site/you") && !isProfessionalSearch) {
      this.searchedUsernameSubject.next(searchTerm.trim());
    }

    try {
      if (this.router.url === "/main-site/groups") {
        return this.groupService.searchGroups(searchTerm).pipe(
          tap(groups => this.searchResultsSubject.next(groups)),
          finalize(() => this.loadingService.hide())
        );
      }

      const endpoint = this.getEndpointByUrl(searchTerm, isProfessionalSearch);
      let params: Record<string, string> | undefined;

      if (this.router.url === "/main-site/events") {
        params = { name: searchTerm };
      }

      return this.fetchService.get<SearchResult>(endpoint, {
        responseType: 'json',
        params
      }).pipe(
        tap(results => this.handleSearchResponse(results, searchTerm, isProfessionalSearch)),
        finalize(() => this.loadingService.hide())
      );
    } catch (error) {
      this.loadingService.hide();
      if (error instanceof Error) {
        this.popupService.showError(error.message);
      }
      throw error;
    }
  }

  handleSearchResponse(response: SearchResult, searchTerm?: string, isProfessionalSearch?: boolean): SearchResult {
    const currentRoute = this.router.url;
    const isProfileRoute = currentRoute === '/main-site/user-profile' || currentRoute === '/main-site/you';

    if (isProfessionalSearch && Array.isArray(response) && currentRoute === "/main-site/user-profile") {
      const filteredProfiles = searchTerm?.trim()
        ? this.filterProfilesBySearchTerm(response as Profile[], searchTerm)
        : response as Profile[];

      this.matchedProfilesSubject.next(filteredProfiles);

      if (filteredProfiles.length > 0) {
        this.searchResultsSubject.next(filteredProfiles[0]);
      } else {
        this.searchResultsSubject.next(null);

        if (!this.errorShown) {
          this.popupService.showError("Nem található ilyen adat!");
          this.errorShown = true;
        }
      }
      return filteredProfiles;
    }

    if ((isProfileRoute && (currentRoute === '/main-site/user-profile' || currentRoute === '/main-site/you')) ||
      (!isProfileRoute && currentRoute.includes(currentRoute))) {
      this.searchResultsSubject.next(response);
    }

    return response;
  }

  private filterProfilesBySearchTerm(profiles: Profile[], searchTerm: string): Profile[] {
    const lowerSearchTerm = searchTerm.toLowerCase();

    return profiles.filter(profile => {
      if (
        profile.usersData.name.toLowerCase().includes(lowerSearchTerm) ||
        profile.usersData.universityName.toLowerCase().includes(lowerSearchTerm) ||
        profile.faculty?.toLowerCase().includes(lowerSearchTerm)
      ) {
        return true;
      }

      if (profile.description?.toLowerCase().includes(lowerSearchTerm)) {
        return true;
      }
      return false;
    });
  }
}