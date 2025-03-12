import { Injectable } from '@angular/core';
import { FetchService } from '../fetch/fetch.service';
import { Observable, shareReplay, of, throwError } from 'rxjs';
import { catchError, timeout, retry, finalize } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserEventService {
  private interestedEventsCache$: Observable<number[]> | null = null;
  private participatingEventsCache$: Observable<number[]> | null = null;

  constructor(
    private fetchService: FetchService,
    private loadingService: LoadingService
  ) { }

  getUserInterestedEvents(): Observable<number[]> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return of([]);
    }

    if (!this.interestedEventsCache$) {
      this.interestedEventsCache$ = this.fetchService.get<number[]>(`/user/get/events_interested_in`, {
        params: { userId }
      }).pipe(
        timeout(10000),
        retry(1),
        catchError(() => {
          return of([]);
        }),
        shareReplay(1)
      );
    }

    return this.interestedEventsCache$;
  }

  getUserParticipatingEvents(): Observable<number[]> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return of([]);
    }

    if (!this.participatingEventsCache$) {
      this.participatingEventsCache$ = this.fetchService.get<number[]>(`/user/get/events_scheduled`, {
        params: { userId }
      }).pipe(
        timeout(10000),
        retry(1),
        catchError(() => {
          return of([]);
        }),
        shareReplay(1)
      );
    }

    return this.participatingEventsCache$;
  }

  addEventInterest(eventId: number): Observable<string> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return throwError(() => new Error('User must be logged in'));
    }

    this.loadingService.show();
    this.interestedEventsCache$ = null;

    return this.fetchService.post<string>(`/groups/event/add/interest`, {
      userId,
      eventId
    }, { responseType: 'text' }).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  removeEventInterest(eventId: number): Observable<string> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return throwError(() => new Error('Nem vagy bejelentkezve!'));
    }

    this.loadingService.show();
    this.interestedEventsCache$ = null;

    return this.fetchService.post<string>(`/groups/event/remove/interest`, {
      userId,
      eventId
    }, { responseType: 'text' }).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  addEventParticipation(eventId: number): Observable<string> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return throwError(() => new Error('Nem vagy bejelentkezve!'));
    }

    this.loadingService.show();
    this.participatingEventsCache$ = null;

    return this.fetchService.post<string>(`/groups/event/add/participant`, {
      userId,
      eventId
    }, { responseType: 'text' }).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  removeEventParticipation(eventId: number): Observable<string> {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      return throwError(() => new Error('Nem vagy bejelentkezve!'));
    }

    this.loadingService.show();
    this.participatingEventsCache$ = null;

    return this.fetchService.post<string>(`/groups/event/remove/participant`, {
      userId,
      eventId
    }, { responseType: 'text' }).pipe(
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  getEventInterestedUsers(eventId: number): Observable<number[]> {
    return this.fetchService.post<number[]>(`/groups/event/interested_users`, {
      eventId
    }).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getEventParticipants(eventId: number): Observable<number[]> {
    return this.fetchService.post<number[]>(`/groups/event/users_schedule`, {
      eventId
    }).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  getUsernameById(userId: number): Observable<string> {
    return this.fetchService.get<string>(`/user/username`, {
      params: { id: userId.toString() },
      responseType: 'text'
    }).pipe(
      catchError(() => {
        return of('Unknown User');
      })
    );
  }

  clearCache(): void {
    this.interestedEventsCache$ = null;
    this.participatingEventsCache$ = null;
  }
}