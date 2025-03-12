import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../services/group/group.service';
import { EventService } from '../../../services/event/event.service';
import { Group } from '../../../models/group/group.model';
import { Event } from '../../../models/event/event.model';
import { SingleEventComponent } from '../single-event/single-event.component';
import { PopupService } from '../../../services/popup-message/popup-message.service';

@Component({
  selector: 'app-opened-group',
  standalone: true,
  imports: [CommonModule, SingleEventComponent],
  templateUrl: './opened-group.component.html',
  styleUrl: './opened-group.component.css'
})
export class OpenedGroupComponent implements OnInit {
  group?: Group;
  events: Event[] = [];
  loading = false;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private eventService: EventService,
    private popupService: PopupService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const groupId = Number(params.get('id'));
      if (groupId) {
        this.group = this.groupService.getGroupById(groupId);

        if (this.group) {
          this.loadGroupEvents(this.group.name);
        }
      }
    });
  }

  private loadGroupEvents(groupName: string) {
    this.loading = true;
    this.eventService.getGroupEvents(groupName).subscribe({
      next: (events) => {
        this.events = events;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.popupService.showError('Hiba az események betöltésekor:');
      }
    });
  }
}