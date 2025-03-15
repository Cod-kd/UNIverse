import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../models/event/event.model';
import { ButtonComponent } from '../../general-components/button/button.component';
import { UserEventService } from '../../../services/user-event/user-event.service';
import { combineLatest, map, forkJoin, finalize } from 'rxjs';
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
  showingUserList = false;
  userListType: 'interested' | 'participants' = 'participants';
  userList: { id: number, username: string }[] = [];
  loadingUsers = false;
  creatorName: string = '';
  isLoadingCreator = false;

  constructor(
    private userEventService: UserEventService,
    private popupService: PopupService
  ) { }

  ngOnInit(): void {
    this.loadUserEventStatus();
    this.loadCreatorInfo();
  }

  loadCreatorInfo(): void {
    if (!this.event?.creatorId) return;

    this.isLoadingCreator = true;
    this.userEventService.getUsernameById(this.event.creatorId)
      .pipe(finalize(() => this.isLoadingCreator = false))
      .subscribe({
        next: (username) => this.creatorName = username,
        error: () => this.popupService.showError('Hiba a készítő betöltése közben!')
      });
  }

  isEventPassed(): boolean {
    if (!this.event.endDate) {
      return this.event.startDate ? new Date(this.event.startDate) < new Date() : false;
    }
    return new Date(this.event.endDate) < new Date();
  }

  showUsers(type: 'interested' | 'participants'): void {
    this.userListType = type;
    this.showingUserList = true;
    this.loadUsers();
  }

  loadUsers(): void {
    this.loadingUsers = true;
    this.userList = [];

    const userIdsObservable = this.userListType === 'interested'
      ? this.userEventService.getEventInterestedUsers(this.event.id)
      : this.userEventService.getEventParticipants(this.event.id);

    userIdsObservable.subscribe({
      next: (userIds) => {
        if (userIds.length === 0) {
          this.loadingUsers = false;
          return;
        }

        const userRequests = userIds.map(id =>
          this.userEventService.getUsernameById(id).pipe(
            map(username => ({ id, username }))
          )
        );

        forkJoin(userRequests).subscribe({
          next: (users) => {
            this.userList = users;
            this.loadingUsers = false;
          },
          error: () => {
            this.popupService.showError('Hiba a felhasználó adatainak betöltésekor!');
            this.loadingUsers = false;
          }
        });
      },
      error: () => {
        this.popupService.showError(`Nem sikerült betölteni: ${this.userListType}`);
        this.loadingUsers = false;
      }
    });
  }

  closeUserList(): void {
    this.showingUserList = false;
    this.userList = [];
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
      error: () => {
        this.isLoading = false;
      }
    });
  }

  copyUsername(username: string, event: MouseEvent): void {
    event.stopPropagation();

    navigator.clipboard.writeText(username)
      .then(() => {
        this.popupService.showSuccess(`"${username}" felhasználónév vágólapra másolva!`);
      })
      .catch(() => {
        this.popupService.showError('Nem sikerült másolni a vágólapra');
      });
  }

  toggleInterest(): void {
    if (this.isParticipating) {
      this.popupService.showError('Nem lehetsz érdeklődő, ha már résztvevő vagy');
      return;
    }

    if (this.isInterested) {
      this.userEventService.removeEventInterest(this.event.id).subscribe({
        next: (response) => {
          this.isInterested = false;
          this.event.interestedUsersCount = Math.max(0, this.event.interestedUsersCount - 1);
          this.popupService.showSuccess(response || 'Sikeresen törölted az érdeklődésedet');
        },
        error: () => {
          this.popupService.showError('Hiba történt az érdeklődés törlésekor');
        }
      });
    } else {
      this.userEventService.addEventInterest(this.event.id).subscribe({
        next: (response) => {
          this.isInterested = true;
          this.event.interestedUsersCount++;
          this.popupService.showSuccess(response || 'Sikeresen érdeklődőnek jelölted magad');
        },
        error: () => {
          this.popupService.showError('Hiba történt az érdeklődés hozzáadásakor');
        }
      });
    }
  }

  toggleParticipation(): void {
    if (this.isInterested) {
      this.popupService.showError('Nem lehetsz résztvevő, ha már érdeklődő vagy');
      return;
    }

    if (this.isParticipating) {
      this.userEventService.removeEventParticipation(this.event.id).subscribe({
        next: (response) => {
          this.isParticipating = false;
          this.event.participantsCount = Math.max(0, this.event.participantsCount - 1);
          this.popupService.showSuccess(response || 'Sikeresen törölted a részvételedet');
        },
        error: () => {
          this.popupService.showError('Hiba történt a részvétel törlésekor');
        }
      });
    } else {
      this.userEventService.addEventParticipation(this.event.id).subscribe({
        next: (response) => {
          this.isParticipating = true;
          this.event.participantsCount++;
          this.popupService.showSuccess(response || 'Sikeresen résztvevőnek jelölted magad');
        },
        error: () => {
          this.popupService.showError('Hiba történt a részvétel hozzáadásakor');
        }
      });
    }
  }
}