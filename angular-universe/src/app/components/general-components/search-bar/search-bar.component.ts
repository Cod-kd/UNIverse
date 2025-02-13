import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SearchService } from '../../../services/search/search.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Input() isMobileSearch: boolean = false;

  constructor(
    private router: Router,
    private searchService: SearchService,
    private popupService: PopupService
  ) { }

  private getFetchByUrl(): string {
    switch (this.router.url) {
      case "/main-site/profile":
        return "/user/name/";
      case "/main-site/groups":
        return "/groups/search?name=";
      case "/main-site/events":
        return "/events/search?name=";
      case "/main-site/calendar":
        return "/unknown";
      default:
        throw new Error("Unknown url");
    }
  }

  async search(event: Event, value: string) {
    event?.preventDefault();

    try {
      const endpoint = this.getFetchByUrl();
      this.searchService.search(endpoint, value).subscribe({
        next: (response) => {
          this.searchService.handleSearchResponse(response);
        },
        error: (err) => {
          this.searchService.handleError(err);
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        this.popupService.show(error.message);
      }
    }
  }
}