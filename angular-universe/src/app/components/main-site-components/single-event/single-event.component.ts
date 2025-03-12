import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../models/event/event.model';
import { ButtonComponent } from '../../general-components/button/button.component';
import { UserEventService } from '../../../services/user-event/user-event.service';
import { combineLatest } from 'rxjs';
import { PopupService } from '../../../services/popup-message/popup-message.service';

@Component({
  selector: 'app-single-event',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css'
})
export class SingleEventComponent implements OnInit {
  @Input() event!: Event;

  isInterested = false;
  isParticipating = false;
  isLoading = true;

  constructor(
    private userEventService: UserEventService,
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.loadUserEventStatus();
  }

  loadUserEventStatus(): void {
    this.isLoading = true;

    combineLatest([
      this.userEventService.getUserInterestedEvents(),
      this.userEventService.getUserParticipatingEvents()
    ]).subscribe({
      next: ([interestedEvents, participatingEvents]) => {
        this.isInterested = interestedEvents.includes(this.event.id);
        this.isParticipating = participatingEvents.includes(this.event.id);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load user event status', error);
        this.isLoading = false;
      }
    });
  }

  toggleInterest(): void {
    if (this.isParticipating) {
      this.popupService.showError('Nem lehetsz érdeklődő, ha már résztvevő vagy');
      return;
    }

    // Handle text responses
    if (this.isInterested) {
      this.userEventService.removeEventInterest(this.event.id).subscribe({
        next: (response) => {
          this.isInterested = false;
          this.event.interestedUsersCount = Math.max(0, this.event.interestedUsersCount - 1);
          this.popupService.showSuccess(response || 'Sikeresen törölted az érdeklődésedet');
        },
        error: (error) => {
          this.popupService.showError('Hiba történt az érdeklődés törlésekor');
          console.error('Error removing interest', error);
        }
      });
    } else {
      this.userEventService.addEventInterest(this.event.id).subscribe({
        next: (response) => {
          this.isInterested = true;
          this.event.interestedUsersCount++;
          this.popupService.showSuccess(response || 'Sikeresen érdeklődőnek jelölted magad');
        },
        error: (error) => {
          this.popupService.showError('Hiba történt az érdeklődés hozzáadásakor');
          console.error('Error adding interest', error);
        }
      });
    }
  }

  toggleParticipation(): void {
    if (this.isInterested) {
      this.popupService.showError('Nem lehetsz résztvevő, ha már érdeklődő vagy');
      return;
    }

    // Handle text responses
    if (this.isParticipating) {
      this.userEventService.removeEventParticipation(this.event.id).subscribe({
        next: (response) => {
          this.isParticipating = false;
          this.event.participantsCount = Math.max(0, this.event.participantsCount - 1);
          this.popupService.showSuccess(response || 'Sikeresen törölted a részvételedet');
        },
        error: (error) => {
          this.popupService.showError('Hiba történt a részvétel törlésekor');
          console.error('Error removing participation', error);
        }
      });
    } else {
      this.userEventService.addEventParticipation(this.event.id).subscribe({
        next: (response) => {
          this.isParticipating = true;
          this.event.participantsCount++;
          this.popupService.showSuccess(response || 'Sikeresen résztvevőnek jelölted magad');
        },
        error: (error) => {
          this.popupService.showError('Hiba történt a részvétel hozzáadásakor');
          console.error('Error adding participation', error);
        }
      });
    }
  }
}