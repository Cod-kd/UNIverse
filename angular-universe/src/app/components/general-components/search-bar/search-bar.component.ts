import { Component } from '@angular/core';
import { SearchService, SearchResult } from '../../../services/search/search.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  constructor(
    private searchService: SearchService,
  ) { }

  async search(event: Event, value: string) {
    event?.preventDefault();

    this.searchService.search(value).subscribe({
      next: (response: SearchResult) => this.searchService.handleSearchResponse(response),
      error: (err) => this.searchService.handleError(err)
    });
  }
}