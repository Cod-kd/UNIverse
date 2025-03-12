import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../services/group/group.service';
import { EventService } from '../../../services/event/event.service';
import { UserEventService } from '../../../services/user-event/user-event.service';
import { Group } from '../../../models/group/group.model';
import { Event } from '../../../models/event/event.model';
import { SingleEventComponent } from '../single-event/single-event.component';
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { Subscription } from 'rxjs';
import { ButtonComponent } from "../../general-components/button/button.component";
import { CreateEventPopupComponent } from '../create-event-popup/create-event-popup.component';

@Component({
  selector: 'app-opened-group',
  standalone: true,
  imports: [CommonModule, SingleEventComponent, ButtonComponent, CreateEventPopupComponent],
  templateUrl: './opened-group.component.html',
  styleUrl: './opened-group.component.css'
})
export class OpenedGroupComponent implements OnInit, OnDestroy {
  group?: Group;
  events: Event[] = [];
  loading = false;
  error = '';
  showEventCreationPopup = false;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private eventService: EventService,
    private userEventService: UserEventService,
    private popupService: PopupService
  ) { }

  ngOnInit() {
    this.userEventService.clearCache();

    this.subscriptions.add(
      this.route.paramMap.subscribe(params => {
        const groupId = Number(params.get('id'));
        if (groupId) {
          this.group = this.groupService.getGroupById(groupId);

          if (this.group) {
            this.loadGroupEvents(this.group.name);
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadGroupEvents(groupName: string) {
    this.loading = true;
    this.subscriptions.add(
      this.eventService.getGroupEvents(groupName).subscribe({
        next: (events) => {
          this.events = events;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = 'Hiba az események betöltésekor';
        }
      })
    );
  }

  createEvent(): void {
    this.showEventCreationPopup = true;
  }

  onCancelEventCreation(): void {
    this.showEventCreationPopup = false;
  }

  onSubmitEventCreation(eventData: any): void {
    if (!this.group) {
      this.popupService.showError('Csoport nem található');
      return;
    }

    this.subscriptions.add(
      this.eventService.createEvent(this.group.name, eventData).subscribe({
        next: () => {
          this.popupService.showSuccess('Esemény sikeresen létrehozva');
          this.showEventCreationPopup = false;
          this.loadGroupEvents(this.group!.name);
        }
      })
    );
  }
}