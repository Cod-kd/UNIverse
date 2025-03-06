import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleGroupComponent } from '../single-group/single-group.component';
import { Group } from '../../../models/group/group.model';
import { GroupService } from '../../../services/group/group.service';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, SingleGroupComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  activeGroupId: number | null = null;

  constructor(private groupService: GroupService) {
    this.groupService.groups$.subscribe(groups => {
      this.groups = groups;
    });
  }

  ngOnInit() {
    this.fetchAllGroups();
  }

  private fetchAllGroups() {
    this.groupService.fetchAllGroups().subscribe();
  }

  handleGroupToggle(groupId: number) {
    if (this.activeGroupId !== groupId) {
      this.groupService.checkGroupMembership(groupId).subscribe();
    }

    this.activeGroupId = this.activeGroupId === groupId ? null : groupId;
  }

  isGroupExpanded(groupId: number): boolean {
    return this.activeGroupId === groupId;
  }
}