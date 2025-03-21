import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../services/group/group.service';
import { EventService } from '../../../services/event/event.service';
import { UserEventService } from '../../../services/user-event/user-event.service';
import { Group } from '../../../models/group/group.model';
import { Event } from '../../../models/event/event.model';
import { Post } from '../../../models/post/post.model';
import { SingleEventComponent } from '../single-event/single-event.component';
import { PostService } from '../../../services/post/post.service';
import { SinglePostComponent } from '../single-post/single-post.component';
import { CreatePostComponent } from '../create-post/create-post.component';
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { Subscription } from 'rxjs';
import { ButtonComponent } from "../../general-components/button/button.component";
import { CreateEventPopupComponent } from '../create-event-popup/create-event-popup.component';

@Component({
  selector: 'app-opened-group',
  standalone: true,
  imports: [CommonModule, SingleEventComponent, ButtonComponent, CreateEventPopupComponent,
    SinglePostComponent, CreatePostComponent],
  templateUrl: './opened-group.component.html',
  styleUrl: './opened-group.component.css'
})
export class OpenedGroupComponent implements OnInit, OnDestroy {
  group?: Group;
  events: Event[] = [];
  posts: Post[] = [];
  eventsLoading = false;
  postsLoading = false;
  eventsError = '';
  postsError = '';
  showEventCreationPopup = false;
  showPostCreation = false;
  private subscriptions = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService,
    private eventService: EventService,
    private postService: PostService,
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
            this.loadGroupPosts(this.group.name);
          }
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private loadGroupEvents(groupName: string) {
    this.eventsLoading = true;
    this.subscriptions.add(
      this.eventService.getGroupEvents(groupName).subscribe({
        next: (events) => {
          this.events = this.sortEvents(events);
          this.eventsLoading = false;
        },
        error: () => {
          this.eventsLoading = false;
          this.eventsError = 'Hiba az események betöltésekor';
        }
      })
    );
  }

  private loadGroupPosts(groupName: string) {
    this.postsLoading = true;
    this.subscriptions.add(
      this.postService.getGroupPosts(groupName).subscribe({
        next: (posts) => {
          this.posts = posts;
          this.postsLoading = false;
        },
        error: () => {
          this.postsLoading = false;
          this.postsError = 'Hiba a bejegyzések betöltésekor';
        }
      })
    );
  }

  sortEvents(events: Event[]): Event[] {
    return [...events].sort((a, b) => {
      const aExpired = this.isEventExpired(a);
      const bExpired = this.isEventExpired(b);

      if (aExpired === bExpired) {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      }

      return aExpired ? 1 : -1;
    });
  }

  isEventExpired(event: Event): boolean {
    if (!event.endDate) {
      return event.startDate ? new Date(event.startDate) < new Date() : false;
    }
    return new Date(event.endDate) < new Date();
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
        },
        error: () => {
          this.popupService.showError('Hiba az esemény létrehozásakor');
        }
      })
    );
  }

  createPost(postData: { content: string, file?: File }): void {
    if (!this.group) {
      this.popupService.showError('Csoport nem található');
      return;
    }

    this.subscriptions.add(
      this.postService.createPost(this.group.name, postData.content, postData.file).subscribe({
        next: () => {
          this.popupService.showSuccess('Bejegyzés sikeresen létrehozva');
          this.showPostCreation = false;
        },
        error: () => {
          this.popupService.showError('Hiba a bejegyzés létrehozásakor');
        }
      })
    );
  }
}