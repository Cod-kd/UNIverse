import { Injectable } from '@angular/core';
import { FetchService } from '../fetch/fetch.service';
import { Observable } from 'rxjs';
import { Event } from '../../models/event/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  constructor(private fetchService: FetchService) { }

  getGroupEvents(groupName: string): Observable<Event[]> {
    return this.fetchService.post<Event[]>(`/groups/name/${groupName}/events`, {});
  }
}