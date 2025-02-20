import { Component, OnInit } from '@angular/core';
import { SearchService, SearchResult } from '../../../services/search/search.service';

@Component({
  selector: 'app-self-profile',
  standalone: true,
  imports: [],
  templateUrl: './self-profile.component.html',
  styleUrl: './self-profile.component.css'
})
export class SelfProfileComponent implements OnInit {
  profile: any = null;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.searchResults$.subscribe((result: SearchResult) => {
      if (result && 'usersData' in result) {
        this.profile = result;
      }
      console.log('Fetched search results:', result);
    });
  }
}
