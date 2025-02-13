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

  constructor(private searchService: SearchService) { }

  ngOnInit() {
    this.searchService.searchResults$.subscribe((results: Group[]) => {
      this.groups = results;
    });
  }
}