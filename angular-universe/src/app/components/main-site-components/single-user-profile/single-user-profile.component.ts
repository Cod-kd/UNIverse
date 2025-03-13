import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';

@Component({
  selector: 'app-single-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './single-user-profile.component.html',
  styleUrl: './single-user-profile.component.css'
})
export class SingleUserProfileComponent {
  @Input() profile!: Profile;
  @Output() selectProfile = new EventEmitter<Profile>();

  getProfileImageSrc(): string {
    if (!this.profile) return '';

    return '/images/default-pfp.jpg';
  }
}
