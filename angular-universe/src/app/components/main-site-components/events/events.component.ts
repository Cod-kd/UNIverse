import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event/event.service';
import { UserEventService } from '../../../services/user-event/user-event.service';
import { SingleEventComponent } from '../single-event/single-event.component';
import { Event } from '../../../models/event/event.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, map } from 'rxjs/operators';
import { PopupService } from '../../../services/popup-message/popup-message.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, SingleEventComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  participatingEvents: Event[] = [];
  interestedEvents: Event[] = [];
  isLoading = true;

  constructor(
    private eventService: EventService,
    private userEventService: UserEventService,
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.userEventService.clearCache();
    this.loadUserEvents();
  }

  private loadUserEvents(): void {
    forkJoin({
      participating: this.userEventService.getUserParticipatingEvents().pipe(
        catchError(() => {
          this.popupService.showError('Could not load your participating events');
          return of([]);
        })
      ),
      interested: this.userEventService.getUserInterestedEvents().pipe(
        catchError(error => {
          this.popupService.showError('Could not load your interested events');
          return of([]);
        })
      )
    }).pipe(
      switchMap(({ participating, interested }) => {
        const getParticipatingEvents = this.getEventDetailsByIds(participating);
        const getInterestedEvents = this.getEventDetailsByIds(interested);

        return forkJoin({
          participatingEvents: getParticipatingEvents,
          interestedEvents: getInterestedEvents
        });
      }),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: ({ participatingEvents, interestedEvents }) => {
        this.participatingEvents = participatingEvents;
        this.interestedEvents = interestedEvents;
      },
      error: () => {
        this.popupService.showError('Failed to load event details');
      }
    });
  }

  private getEventDetailsByIds(eventIds: number[]): Observable<Event[]> {
    if (eventIds.length === 0) {
      return of([]);
    }

    const eventObservables = eventIds.map(id =>
      this.eventService.getEventById(id).pipe(
        
      )
    );

    return forkJoin(eventObservables).pipe(
      map(events => events.filter(event => event !== null) as Event[])
    );

  }
}