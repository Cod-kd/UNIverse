import { Component, ViewChild, ElementRef, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Profile } from '../../../models/profile/profile.model';
import { SearchService } from '../../../services/search/search.service';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../services/university/university.service';
import { FollowService } from '../../../services/follow/follow.service';
import { ButtonComponent } from '../../general-components/button/button.component';
import { SingleUserProfileComponent } from '../single-user-profile/single-user-profile.component';
import html2canvas from 'html2canvas';
import { catchError, tap, takeUntil, switchMap } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { PopupService } from '../../../services/popup-message/popup-message.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SingleUserProfileComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('profileCard') profileCard!: ElementRef;
  profile: Profile | null = null;
  isFriendAdded = false;
  isProfileSaved = false;
  isFollowInProgress = false;
  isFollowing = false;
  matchedProfiles: Profile[] = [];

  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  searchedUsername: string = '';
  currentUserId: string | null = null;

  universityMap: Map<string, string> = new Map();
  facultyMap: Map<string, string[]> = new Map();

  universityName: string = '';
  facultyName: string = '';

  get followButtonLabel(): string {
    return this.isFollowing ? 'Követés leállítása' : 'Követés';
  }

  get followButtonIcon(): string {
    return this.isFollowing
      ? 'fa-solid fa-user-times'
      : 'fa-solid fa-user-plus';
  }

  constructor(
    private searchService: SearchService,
    private universityService: UniversityService,
    private followService: FollowService,
    private popupService: PopupService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentUserId = localStorage.getItem('userId');

    this.searchService.searchResults$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(result => {
          if (result && !Array.isArray(result)) {
            this.profile = result as Profile;
            this.updateUniversityAndFaculty();
            this.isProfileSaved = false;

            if (this.currentUserId && this.profile) {
              return this.followService.checkFollowStatus(
                this.currentUserId,
                this.profile.usersData.userId
              ).pipe(
                catchError(() => of(false))
              );
            }
            return of(false);
          }
          return of(false);
        })
      )
      .subscribe({
        next: (isFollowing) => {
          this.isFollowing = isFollowing;
        }
      });

    this.searchService.searchedUsername$
      .pipe(takeUntil(this.destroy$))
      .subscribe(username => {
        if (username) {
          this.searchedUsername = username;
          if (!this.profile) {
            this.profile = null;
          }
        }
      });

    this.searchService.matchedProfiles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profiles => {
        this.matchedProfiles = profiles;
      });
  }

  ngOnInit(): void {
    this.universityService.getUniversities()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (universities) => {
          universities.forEach(uni => {
            this.universityMap.set(uni.value, uni.label);
          });
          this.updateUniversityAndFaculty();
        },
        error: (error) => this.popupService.showError(`Hiba: ${error}`)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectProfile(profile: Profile): void {
    this.profile = profile;
    this.updateUniversityAndFaculty();

    if (this.currentUserId && this.profile) {
      this.followService.checkFollowStatus(
        this.currentUserId,
        this.profile.usersData.userId
      ).pipe(
        catchError(() => of(false)),
        takeUntil(this.destroy$)
      ).subscribe(isFollowing => {
        this.isFollowing = isFollowing;
      });
    }
  }

  private updateUniversityAndFaculty(): void {
    if (!this.profile) return;

    const uniValue = this.profile.usersData.universityName;
    this.universityName = this.universityMap.get(uniValue) || uniValue;

    this.universityService.loadFaculties(uniValue);
    this.universityService.faculties$
      .pipe(takeUntil(this.destroy$))
      .subscribe(faculties => {
        const faculty = faculties.find(f => f.label === this.profile?.faculty);
        this.facultyName = faculty?.label || this.profile?.faculty || '';
      });
  }

  getProfileImageSrc(): string {
    if (!this.profile) return '';

    return '/images/cat-pfp.jpg';
  }

  get genderDisplay(): string {
    return this.profile?.usersData.gender ? 'Férfi' : 'Nő';
  }

  startFollowing(): void {
    if (!this.profile || this.isFollowInProgress || !this.searchedUsername) return;

    this.isFollowInProgress = true;

    const followAction = this.isFollowing
      ? this.followService.unfollowUser(this.searchedUsername)
      : this.followService.followUser(this.searchedUsername);

    followAction
      .pipe(
        tap(() => {
          if (this.profile) {
            this.profile.usersData.followerCount += this.isFollowing ? -1 : 1;
            this.isFollowing = !this.isFollowing;
          }
        }),
        catchError(() => {
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: () => { },
        error: () => { },
        complete: () => this.isFollowInProgress = false
      });
  }

  async saveProfile() {
    if (!this.profileCard || !this.isBrowser) return;

    const card = this.profileCard.nativeElement;
    card.classList.add('capture-animation');

    const originalBorderRadius = card.style.borderRadius;

    try {
      card.style.borderRadius = '0';

      await new Promise(resolve => setTimeout(resolve, 600));

      const canvas = await html2canvas(card, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: null
      });

      const link = document.createElement('a');
      const imageName = this.profile?.usersData.name?.replace(/\s+/g, '-');
      link.download = `${imageName || 'profile'}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      this.isProfileSaved = true;
    }
    finally {
      card.style.borderRadius = originalBorderRadius;
      card.classList.remove('capture-animation');
    }
  }

  spinProfilePicture(event: Event) {
    if (!this.isBrowser) return;

    const image = event.target as HTMLElement;
    image.classList.remove('spin');

    requestAnimationFrame(() => {
      image.classList.add('spin');
    });
  }
}