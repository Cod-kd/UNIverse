import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';
import { CommonModule } from '@angular/common';
import { ProfileImageService } from '../../../services/profile-image/profile-image.service';

@Component({
  selector: 'app-single-user-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-user-profile.component.html',
  styleUrl: './single-user-profile.component.css'
})
export class SingleUserProfileComponent implements OnChanges {
  @Input() profile!: Profile;
  @Output() selectProfile = new EventEmitter<Profile>();

  private defaultPfp = 'https://holydrive.org/api/view/4eaef8d354bfbf649f7faf380a810376';
  profileImageUrl: string = this.defaultPfp;

  constructor(
    private profileImageService: ProfileImageService
  ) { }

  ngOnChanges(): void {
    this.updateProfileImage();
  }

  updateProfileImage(): void {
    this.profileImageUrl = this.getProfileImageSrc();
  }

  getProfileImageSrc(): string {
    if (!this.profile?.usersData?.userId) return this.defaultPfp;
    return this.profileImageService.getProfileImageUrl(this.profile.usersData.userId);
  }
}