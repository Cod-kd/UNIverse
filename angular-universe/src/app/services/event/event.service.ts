import { Injectable } from '@angular/core';
import { FetchService } from '../fetch/fetch.service';
import { Observable, forkJoin, of } from 'rxjs';
import { Event } from '../../models/event/event.model';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private fetchService: FetchService) { }

  getGroupEvents(groupName: string): Observable<Event[]> {
    return this.fetchService.post<Event[]>(`/groups/name/${groupName}/events`, {});
  }

  createEvent(groupName: string, eventData: any): Observable<string> {
    return this.fetchService.post<string>(`/groups/name/${groupName}/newevent`, eventData, {
      responseType: 'text'
    });
  }

  getEventById(eventId: number): Observable<Event> {
    return this.fetchService.get<Event>(`/user/get/event`, {
      params: { eventId: eventId.toString() }
    });
  }

  getEventsByIds(eventIds: number[]): Observable<Event[]> {
    if (eventIds.length === 0) {
      return of([]);
    }

    const requests = eventIds.map(id => this.getEventById(id).pipe(
      catchError(error => {
        console.error(`Error fetching event ${id}:`, error);
        return of(null);
      })
    ));

    return forkJoin(requests).pipe(
      map(events => events.filter(event => event !== null) as Event[])
    );
  }
}