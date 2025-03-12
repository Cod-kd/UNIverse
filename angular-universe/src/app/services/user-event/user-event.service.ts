import { Injectable } from '@angular/core';
import { FetchService } from '../fetch/fetch.service';
import { Observable, map, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserEventService {
  private interestedEventsCache$: Observable<number[]> | null = null;
  private participatingEventsCache$: Observable<number[]> | null = null;

  constructor(private fetchService: FetchService) { }

  getUserInterestedEvents(): Observable<number[]> {
    const userId = localStorage.getItem('userId');

    if (!this.interestedEventsCache$) {
      this.interestedEventsCache$ = this.fetchService.get<number[]>(`/user/get/events_interested_in`, {
        params: { userId: userId || '' }
      }).pipe(shareReplay(1));
    }

    return this.interestedEventsCache$;
  }

  getUserParticipatingEvents(): Observable<number[]> {
    const userId = localStorage.getItem('userId');

    if (!this.participatingEventsCache$) {
      this.participatingEventsCache$ = this.fetchService.get<number[]>(`/user/get/events_scheduled`, {
        params: { userId: userId || '' }
      }).pipe(shareReplay(1));
    }

    return this.participatingEventsCache$;
  }

  // Using text responseType for endpoints that return text
  addEventInterest(eventId: number): Observable<string> {
    const userId = localStorage.getItem('userId');
    this.interestedEventsCache$ = null;

    return this.fetchService.post<string>(`/groups/event/add/interest`, {
      userId,
      eventId
    }, { responseType: 'text' });
  }

  removeEventInterest(eventId: number): Observable<string> {
    const userId = localStorage.getItem('userId');
    this.interestedEventsCache$ = null;

    return this.fetchService.post<string>(`/groups/event/remove/interest`, {
      userId,
      eventId
    }, { responseType: 'text' });
  }

  addEventParticipation(eventId: number): Observable<string> {
    const userId = localStorage.getItem('userId');
    this.participatingEventsCache$ = null;

    return this.fetchService.post<string>(`/groups/event/add/participant`, {
      userId,
      eventId
    }, { responseType: 'text' });
  }

  removeEventParticipation(eventId: number): Observable<string> {
    const userId = localStorage.getItem('userId');
    this.participatingEventsCache$ = null;

    return this.fetchService.post<string>(`/groups/event/remove/participant`, {
      userId,
      eventId
    }, { responseType: 'text' });
  }

  clearCache(): void {
    this.interestedEventsCache$ = null;
    this.participatingEventsCache$ = null;
  }
}