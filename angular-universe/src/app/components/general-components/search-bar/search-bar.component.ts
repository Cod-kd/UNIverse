import { Component, Input } from '@angular/core';
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
    private searchService: SearchService,
    private popupService: PopupService
  ) { }

  async search(event: Event, value: string) {
    event?.preventDefault();

    try {
      this.searchService.search(value).subscribe({
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