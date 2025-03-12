import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group } from '../../../models/group/group.model';
import { ButtonComponent } from '../../general-components/button/button.component';
import { GroupService } from '../../../services/group/group.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-single-group',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './single-group.component.html',
  styleUrl: './single-group.component.css'
})
export class SingleGroupComponent {
  @Input() group!: Group;
  @Input() isExpanded: boolean = false;
  @Output() toggleRequest = new EventEmitter<number>();

  constructor(private groupService: GroupService, private router: Router) { }

  toggleExpand(event: Event) {
    event.stopPropagation();
    this.toggleRequest.emit(this.group.id);
  }

  joinGroup(event: Event) {
    event.stopPropagation();

    if (this.group.isMember) {
      this.router.navigate(['/main-site/groups', this.group.id]);
    } else {
      this.groupService.joinGroup(this.group).subscribe();
    }
  }

  leaveGroup(event: Event) {
    event.stopPropagation();
    this.groupService.leaveGroup(this.group).subscribe({
    });
  }

  getButtonLabel(): string {
    return this.group.isMember ? 'Megnyitás' : 'Belépés';
  }

  getButtonIcon(): string {
    return this.group.isMember ? 'fa-arrow-right' : 'fa-sign-in';
  }
}