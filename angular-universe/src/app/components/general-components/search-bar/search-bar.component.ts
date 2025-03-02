import { Component, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { SearchService, SearchResult } from '../../../services/search/search.service';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css',
  animations: [
    trigger('searchState', [
      state('inactive', style({
        opacity: 1,
        transform: 'scale(1)'
      })),
      state('active', style({
        opacity: 1,
        transform: 'scale(1.02)'
      })),
      state('searching', style({
        opacity: 1,
        transform: 'scale(1.02)'
      })),
      transition('inactive => active', animate('200ms ease-in')),
      transition('active => inactive', animate('200ms ease-out')),
      transition('* => searching', animate('300ms ease-in')),
      transition('searching => *', animate('200ms ease-out'))
    ])
  ]
})
export class SearchBarComponent {
  @ViewChild('searchInput') searchInput!: ElementRef;
  searchState = 'inactive';
  isSearching = false;

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.value = '';
        this.searchState = 'inactive';
        this.isSearching = false;
      }
    });
  }

  onFocus() {
    this.searchState = 'active';
  }

  onBlur() {
    if (!this.isSearching && !this.searchInput.nativeElement.value) {
      this.searchState = 'inactive';
    }
  }

  async search(event: SubmitEvent, value: string) {
    event?.preventDefault();

    const searchTerm = value.trim();

    if (!searchTerm) {
      return;
    }

    this.searchState = 'searching';
    this.isSearching = true;

    this.addRippleEffect();

    this.searchService.search(searchTerm).subscribe({
      next: (response: SearchResult) => {
        this.searchService.handleSearchResponse(response);
        setTimeout(() => {
          this.isSearching = false;
          this.searchState = this.searchInput.nativeElement.value ? 'active' : 'inactive';
        }, 300);
      },
      error: (err) => {
        this.searchService.handleError(err);
        this.isSearching = false;
        this.searchState = this.searchInput.nativeElement.value ? 'active' : 'inactive';
      }
    });
  }

  private addRippleEffect() {
    const button = document.getElementById('search');
    if (!button) return;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    button.appendChild(ripple);

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);

    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${rect.width / 2 - size / 2}px`;
    ripple.style.top = `${rect.height / 2 - size / 2}px`;

    setTimeout(() => ripple.remove(), 600);
  }
}