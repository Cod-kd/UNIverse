import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { SearchService, SearchResult } from '../../../services/search/search.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {
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

    const searchTerm = value.trim();

    if (!searchTerm) {
      return;
    }

    this.searchService.search(searchTerm).subscribe({
      next: (response: SearchResult) => this.searchService.handleSearchResponse(response),
      error: (err) => this.searchService.handleError(err)
    });
  }
}