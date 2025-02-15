import { Component } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';
import { SearchService } from '../../../services/search/search.service';

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
    this.searchService.searchResults$.subscribe((result) => {
      if (result && !Array.isArray(result)) {
        this.profile = result as Profile;
      }
    });
  }
}