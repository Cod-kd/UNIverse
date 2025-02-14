import { Component } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';
import { SearchService } from '../../../services/search/search.service';
import { SearchBarComponent } from '../../general-components/search-bar/search-bar.component';

@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [SearchBarComponent],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})
export class ProfilesComponent {
  profile: Profile | null = null;

  constructor(private searchService: SearchService) {
    // Subscribe to search results when the component is created
    this.searchService.searchResults$.subscribe((result: any) => {
      this.profile = result;
    });
  }

  // Remove ngOnInit as we don't want to fetch data on component initialization
}