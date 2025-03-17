import { Injectable } from '@angular/core';
import { AuthType, FetchService } from '../fetch/fetch.service';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { Event } from '../../models/event/event.model';
import { map, catchError, timeout, retry, finalize } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(
    private fetchService: FetchService,
    private loadingService: LoadingService
  ) { }

  getGroupEvents(groupName: string): Observable<Event[]> {
    this.loadingService.show();
    return this.fetchService.post<Event[]>(`/groups/name/${groupName}/events`,{}, { authType: AuthType.NONE }).pipe(
      timeout(10000),
      retry(1),
      catchError(() => {
        return of([]);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  createEvent(groupName: string, eventData: any): Observable<string> {
    this.loadingService.show();
    return this.fetchService.post<string>(`/groups/name/${groupName}/newevent`, eventData,{
      responseType: 'text',
      authType: AuthType.JWT
    }).pipe(
      timeout(15000),
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  getEventById(eventId: number): Observable<Event> {
    return this.fetchService.get<Event>(`/user/get/event`, {
      params: { eventId: eventId.toString() }, authType: AuthType.NONE
    }).pipe(
      timeout(8000),
      retry(1),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  getEventsByIds(eventIds: number[]): Observable<Event[]> {
    if (!eventIds?.length) {
      return of([]);
    }

    const requests = eventIds.map(id => this.getEventById(id).pipe(
      catchError(() => {
        return of(null);
      })
    ));

    return forkJoin(requests).pipe(
      map(events => events.filter(event => event !== null) as Event[])
    );
  }
}