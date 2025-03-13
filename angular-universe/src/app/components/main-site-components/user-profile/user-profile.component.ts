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
import { catchError, tap, takeUntil, switchMap, finalize } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ConstantsService } from '../../../services/constants/constants.service';
import { FetchService } from '../../../services/fetch/fetch.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ButtonComponent, SingleUserProfileComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, OnDestroy {
  @ViewChild('profileCard') profileCard!: ElementRef;
  @ViewChild('profileContainer') profileContainer!: ElementRef;
  profile: Profile | null = null;
  isFriendAdded = false;
  isProfileSaved = false;
  isFollowInProgress = false;
  isFollowing = false;
  matchedProfiles: Profile[] = [];
  username: string = '';

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
    private router: Router,
    private constantsService: ConstantsService,
    private fetchService: FetchService,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.currentUserId = localStorage.getItem('userId');

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: any) => {
      if (event.url === '/main-site/user-profile') {
        this.profile = null;
        this.matchedProfiles = [];
        this.searchedUsername = '';
        this.username = '';
      }
    });

    this.searchService.searchResults$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(result => {
          if (result && !Array.isArray(result)) {
            this.profile = result as Profile;
            this.updateUniversityAndFaculty();
            this.isProfileSaved = false;

            if (this.profile) {
              // Convert userId to number if it's a string
              const userId = typeof this.profile.userId === 'string'
                ? parseInt(this.profile.userId, 10)
                : this.profile.userId;

              this.fetchUsername(userId);
              this.scrollToProfileView();
            }

            if (this.currentUserId && this.profile) {
              return this.followService.checkFollowStatus(
                this.currentUserId,
                this.profile.userId
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
        }
      });

    this.searchService.matchedProfiles$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profiles => {
        this.matchedProfiles = profiles;
      });
  }

  ngOnInit(): void {
    this.profile = null;
    this.matchedProfiles = [];
    this.username = '';

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

  fetchUsername(userId: number): void {
    this.username = '';

    this.fetchService.get<string>(`/user/username`, {
      responseType: 'text',
      params: { id: userId.toString() }
    })
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
        })
      )
      .subscribe({
        next: (username) => {
          this.username = username;
        },
        error: () => {
        }
      });
  }

  selectProfile(profile: Profile): void {
    this.profile = profile;
    this.username = '';
    this.updateUniversityAndFaculty();

    // Convert userId to number if necessary
    const userId = typeof profile.userId === 'string'
      ? parseInt(profile.userId, 10)
      : profile.userId;

    this.fetchUsername(userId);

    if (this.currentUserId && this.profile) {
      this.followService.checkFollowStatus(
        this.currentUserId,
        this.profile.userId
      ).pipe(
        catchError(() => of(false)),
        takeUntil(this.destroy$)
      ).subscribe(isFollowing => {
        this.isFollowing = isFollowing;
      });
    }

    this.scrollToProfileView();
  }

  private scrollToProfileView(offsetY: number = 120): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      const profileContainer = document.getElementById('profile-container');
      if (profileContainer) {
        const rect = profileContainer.getBoundingClientRect();
        const absoluteTop = rect.top + window.scrollY;

        window.scrollTo({
          top: absoluteTop - offsetY,
          behavior: 'smooth'
        });
      }
    }, 100);
  }

  getContactIcon(contactTypeId: number): string {
    const contactType = this.constantsService.getContactTypesSnapshot().find(ct => ct.id === contactTypeId);

    const iconMap: { [key: string]: string } = {
      'Facebook': 'fa-brands fa-facebook',
      'Youtube': 'fa-brands fa-youtube',
      'LinkedIn': 'fa-brands fa-linkedin',
      'GitHub': 'fa-brands fa-github',
      'Tiktok': 'fa-brands fa-tiktok',
    };

    return iconMap[contactType?.name || ''] || 'fa-solid fa-link';
  }

  getContactUrl(contact: any): string {
    if (!contact.path) return '#';

    const contactType = this.constantsService.getContactTypesSnapshot().find(ct => ct.id === contact.contactTypeId);

    if (contact.path.startsWith('http')) {
      return contact.path;
    }

    if (contactType?.protocol && contactType?.domain) {
      return `${contactType.protocol}://${contactType.domain}/${contact.path}`;
    }

    return contact.path;
  }

  getContactTypeById(id: number): string {
    const contactType = this.constantsService.getContactTypesSnapshot().find(ct => ct.id === id);
    return contactType?.name || 'Unknown';
  }

  getRoleById(id: number): string {
    const role = this.constantsService.getRolesSnapshot().find(r => r.id === id);
    return role?.name || 'Unknown';
  }

  getCategoryById(id: number): string {
    const category = this.constantsService.getCategoriesSnapshot().find(c => c.id === id);
    return category?.name || 'Unknown';
  }

  private updateUniversityAndFaculty(): void {
    if (!this.profile) return;

    const uniValue = this.profile.usersData.universityName;
    this.universityName = this.universityMap.get(uniValue) || uniValue;

    this.facultyName = this.universityService.getFacultyNameByAbbreviation(
      uniValue,
      this.profile.faculty || ''
    );

    this.universityService.loadFaculties(uniValue);
  }

  getProfileImageSrc(): string {
    if (!this.profile) return '';

    return '/images/default-pfp.jpg';
  }

  get genderDisplay(): string {
    return this.profile?.usersData.gender === true ? 'Férfi' :
      this.profile?.usersData.gender === false ? 'Nő' : 'Egyéb';
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