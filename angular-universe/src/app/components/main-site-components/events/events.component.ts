import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../services/event/event.service';
import { UserEventService } from '../../../services/user-event/user-event.service';
import { SingleEventComponent } from '../single-event/single-event.component';
import { Event } from '../../../models/event/event.model';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, finalize, switchMap } from 'rxjs/operators';
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
    // Clear cache to ensure fresh data
    this.userEventService.clearCache();
    this.loadUserEvents();
  }

  private loadUserEvents(): void {
    // Get both participating and interested event IDs in parallel
    forkJoin({
      participating: this.userEventService.getUserParticipatingEvents().pipe(
        catchError(error => {
          console.error('Failed to load participating events', error);
          this.popupService.showError('Could not load your participating events');
          return of([]);
        })
      ),
      interested: this.userEventService.getUserInterestedEvents().pipe(
        catchError(error => {
          console.error('Failed to load interested events', error);
          this.popupService.showError('Could not load your interested events');
          return of([]);
        })
      )
    }).pipe(
      // Once we have the IDs, fetch the event details
      switchMap(({ participating, interested }) => {
        // Create observables for each set of events
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
      error: (error) => {
        console.error('Error loading events', error);
        this.popupService.showError('Failed to load event details');
      }
    });
  }

  // Helper method to fetch event details by IDs
  private getEventDetailsByIds(eventIds: number[]): Observable<Event[]> {
    if (eventIds.length === 0) {
      return of([]);
    }

    // This implementation depends on what your backend API supports
    // Option 1: If your backend supports batch fetching by IDs
    return this.eventService.getEventsByIds(eventIds).pipe(
      catchError(error => {
        console.error('Failed to fetch event details', error);
        return of([]);
      })
    );

    // Option 2: If you need to fetch events individually (uncomment if needed)
    /*
    const eventObservables = eventIds.map(id => 
      this.eventService.getEventById(id).pipe(
        catchError(error => {
          console.error(`Failed to fetch event ID ${id}`, error);
          return of(null);
        })
      )
    );

    return forkJoin(eventObservables).pipe(
      map(events => events.filter(event => event !== null) as Event[])
    );
    */
  }
}