import { Component } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';
import { SearchService } from '../../../services/search/search.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile: Profile | null = null;

  constructor(private searchService: SearchService) {
    this.searchService.searchResults$.subscribe((result) => {
      if (result && !Array.isArray(result)) {
        this.profile = result as Profile;
      }
    });
  }
}