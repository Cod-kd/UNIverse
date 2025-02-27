import { Component, ViewChild, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';
import { SearchService } from '../../../services/search/search.service';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../services/university/university.service';
import { FollowService } from '../../../services/follow/follow.service';
import html2canvas from 'html2canvas';
import { catchError, tap, finalize, takeUntil } from 'rxjs/operators';
import { of, Subject } from 'rxjs';
import { PopupService } from '../../../services/popup-message/popup-message.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  @ViewChild('profileCard') profileCard!: ElementRef;
  profile: Profile | null = null;
  isFriendAdded = false;
  isProfileSaved = false;
  isFollowInProgress = false;

  private destroy$ = new Subject<void>();

  searchedUsername: string = '';

  universityMap: Map<string, string> = new Map();
  facultyMap: Map<string, string[]> = new Map();

  universityName: string = '';
  facultyName: string = '';

  constructor(
    private searchService: SearchService,
    private universityService: UniversityService,
    private followService: FollowService,
    private popupService: PopupService
  ) {
    this.searchService.searchResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result && !Array.isArray(result)) {
          this.profile = result as Profile;
          this.updateUniversityAndFaculty();
        //  this.checkFollowStatus();
        }
      });

    this.searchService.searchedUsername$
      .pipe(takeUntil(this.destroy$))
      .subscribe(username => {
        if (username) {
          this.searchedUsername = username;
          this.profile = null;
          if (this.profile) {
          //  this.checkFollowStatus();
          }
        }
      });
  }

  ngOnInit(): void {
    this.universityService.getUniversities()
      .pipe(takeUntil(this.destroy$))
      .subscribe(universities => {
        universities.forEach(uni => {
          this.universityMap.set(uni.value, uni.label);
        });
        this.updateUniversityAndFaculty();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  get genderDisplay(): string {
    return this.profile?.usersData.gender ? 'Férfi' : 'Nő';
  }

  /*
  private checkFollowStatus(): void {
    if (!this.searchedUsername) return;

    this.followService.checkFollowStatus(this.searchedUsername)
      .pipe(
        catchError(error => {
          // Log error but don't show popup for follow status check
          this.popupService.show(`Follow status check failed: ${error}`);
          return of(false);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(isFollowing => {
        this.isFriendAdded = isFollowing;
      });
  }
      */

  startFollowing(): void {
    if (!this.searchedUsername || this.isFollowInProgress || this.isFriendAdded) return;

    this.isFollowInProgress = true;

    this.followService.followUser(this.searchedUsername)
      .pipe(
        tap(() => {
          if (this.profile && !this.isFriendAdded) {
            this.profile.usersData.followerCount++;
          }
        }),
        catchError(error => {
          console.log((`Follow failed: ${error.message || 'Unknown error'}`));
          this.popupService.show(`Follow failed: ${error.message || 'Unknown error'}`);
          return of(null);
        }),
        finalize(() => this.isFollowInProgress = false),
        takeUntil(this.destroy$)
      )
      .subscribe(response => {
        if (response !== null) {
          this.isFriendAdded = true;
        }
      });
  }

  async saveProfile() {
    if (!this.profileCard) return;

    const card = this.profileCard.nativeElement;
    card.classList.add('capture-animation');

    try {
      await new Promise(resolve => setTimeout(resolve, 600));

      const canvas = await html2canvas(card);
      const link = document.createElement('a');
      link.download = `${this.profile?.usersData.name || 'profile'}.png`;
      link.href = canvas.toDataURL();
      link.click();

      this.isProfileSaved = true;
    } catch (error) {
      this.popupService.show('Failed to save profile image');
    } finally {
      card.classList.remove('capture-animation');
    }
  }

  spinProfilePicture(event: Event) {
    const image = event.target as HTMLElement;
    image.classList.remove('spin');
    requestAnimationFrame(() => {
      image.classList.add('spin');
    });
  }
}