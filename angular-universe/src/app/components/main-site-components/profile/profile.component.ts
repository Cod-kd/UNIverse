import { Component, ViewChild, ElementRef } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';
import { SearchService } from '../../../services/search/search.service';
import { CommonModule } from '@angular/common';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  @ViewChild('profileCard') profileCard!: ElementRef;
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

  startFollowing() {
    if (!this.isFriendAdded) {
      this.isFriendAdded = true;
    }
  }

  async saveProfile() {
    if (!this.profileCard) return;

    const card = this.profileCard.nativeElement;
    card.classList.add('capture-animation');

    await new Promise(resolve => setTimeout(resolve, 300));
    await new Promise(resolve => setTimeout(resolve, 300));

    const canvas = await html2canvas(card);
    const link = document.createElement('a');
    link.download = `${this.profile?.usersData.name || 'profile'}.png`;
    link.href = canvas.toDataURL();
    link.click();

    card.classList.remove('capture-animation');
    this.isProfileSaved = true;
  }

  spinProfilePicture(event: Event) {
    const image = event.target as HTMLElement;
    image.classList.remove('spin')
    setTimeout(() => {
      image.classList.add('spin');
    }, 10);
  }

}