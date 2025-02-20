import { Component } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';
import { SearchService } from '../../../services/search/search.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profile: Profile | null = null;
  isFriendAdded = false;
  isProfileSaved = false;

  constructor(private searchService: SearchService) {
    this.searchService.searchResults$.subscribe((result) => {
      if (result && !Array.isArray(result)) {
        this.profile = result as Profile;
      }
    });
  }

  addFriend() {
    if (!this.isFriendAdded) {
      this.isFriendAdded = true;
    }
  }

  saveProfile() {
    if (!this.isProfileSaved) {
      this.isProfileSaved = true;
    }
  }

  spinProfilePicture(event: Event) {
    const image = event.target as HTMLElement;
    image.classList.remove('spin')
    setTimeout(() => {
      image.classList.add('spin');
    }, 10);
  }

}