// opened-group.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GroupService } from '../../../services/group/group.service';
import { Group } from '../../../models/group/group.model';

@Component({
  selector: 'app-opened-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opened-group.component.html',
  styleUrl: './opened-group.component.css'
})
export class OpenedGroupComponent implements OnInit {
  group?: Group;

  constructor(
    private route: ActivatedRoute,
    private groupService: GroupService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const groupId = Number(params.get('id'));
      if (groupId) {
        this.group = this.groupService.getGroupById(groupId);
      }
    });
  }
}