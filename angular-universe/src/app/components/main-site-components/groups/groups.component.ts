import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchService } from '../../../services/search/search.service';
import { SingleGroupComponent } from '../single-group/single-group.component';
import { Group } from '../../../models/group/group.model';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [CommonModule, SingleGroupComponent],
  templateUrl: './groups.component.html',
  styleUrl: './groups.component.css'
})
export class GroupsComponent implements OnInit {
  groups: Group[] = [];
  activeGroupId: number | null = null; // Changed to number type

  constructor(private searchService: SearchService) {
    this.searchService.searchResults$.subscribe((results) => {
      if (Array.isArray(results)) {
        this.groups = results;
      }
    });
  }

  ngOnInit() {
    this.fetchAllGroups();
  }

  private fetchAllGroups() {
    this.searchService.fetchAll().subscribe({
      next: (response) => this.searchService.handleSearchResponse(response),
      error: (err) => this.searchService.handleError(err)
    });
  }

  handleGroupToggle(groupId: number) {
    this.activeGroupId = this.activeGroupId === groupId ? null : groupId;
  }

  isGroupExpanded(groupId: number): boolean {
    return this.activeGroupId === groupId;
  }
}