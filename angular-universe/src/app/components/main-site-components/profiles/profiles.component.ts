import { Component } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';
import { SearchService } from '../../../services/search/search.service';

// profiles.component.ts
@Component({
  selector: 'app-profiles',
  standalone: true,
  imports: [],
  templateUrl: './profiles.component.html',
  styleUrl: './profiles.component.css'
})
export class ProfilesComponent {
  profile: Profile | null = null;

  constructor(private searchService: SearchService) {
    // Subscribe with type checking
    this.searchService.searchResults$.subscribe((result) => {
      if (result && !Array.isArray(result)) {
        this.profile = result as Profile;
      }
    });
  }
}