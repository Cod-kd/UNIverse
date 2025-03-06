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
  isActive = false;
  isSearching = false;
  isProfessionalSearch = false;

  isProfSearch(event: Event): void {
    this.isProfessionalSearch = (event.target as HTMLInputElement).checked;
  }

  showProfessionalSearch(): boolean {
    return this.router.url === "/main-site/user-profile";
  }

  constructor(
    private searchService: SearchService,
    private router: Router
  ) {
    this.router.events.pipe(
      filter((event: RouterEvent): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.searchInput) {
        this.searchInput.nativeElement.value = '';
        this.isActive = false;
        this.isSearching = false;
        this.isProfessionalSearch = false;
      }
    });
  }

  onFocus() {
    this.isActive = true;
  }

  onBlur() {
    if (!this.isSearching && !this.searchInput.nativeElement.value) {
      this.isActive = false;
    }
  }

  async search(event: SubmitEvent, value: string) {
    event?.preventDefault();
    const searchTerm = value.trim();

    if (!searchTerm && !this.isProfessionalSearch) return;

    this.isSearching = true;
    this.addRippleEffect();

    this.searchService.search(searchTerm, this.isProfessionalSearch).subscribe({
      next: (response: SearchResult) => {
        this.searchService.handleSearchResponse(response, searchTerm, this.isProfessionalSearch);
        this.isSearching = false;
        this.isActive = !!this.searchInput.nativeElement.value;
      },
      error: () => {
        this.isSearching = false;
        this.isActive = !!this.searchInput.nativeElement.value;
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

    ripple.remove();
  }
}