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

  // Add new method to get an event by ID
  getEventById(eventId: number): Observable<Event> {
    return this.fetchService.get<Event>(`/groups/event/${eventId}`);
  }

  // Add method to fetch multiple events by IDs
  getEventsByIds(eventIds: number[]): Observable<Event[]> {
    // If your API supports batch queries
    return this.fetchService.post<Event[]>('/groups/events/batch', { eventIds });

    // Alternative implementation if batch endpoint doesn't exist
    /*
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
    */
  }
}