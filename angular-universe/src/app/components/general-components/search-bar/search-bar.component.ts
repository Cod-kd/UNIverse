import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { SearchService, SearchResult } from '../../../services/search/search.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {
    // Clear search input on navigation
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.value = '';
      }
    });
  }

  async search(event: SubmitEvent, value: string) {
    event?.preventDefault();

    this.searchService.search(value).subscribe({
      next: (response: SearchResult) => this.searchService.handleSearchResponse(response),
      error: (err) => this.searchService.handleError(err)
    });
  }
}