import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { Profile } from '../../../models/profile/profile.model';
import { SearchService } from '../../../services/search/search.service';
import { CommonModule } from '@angular/common';
import { UniversityService } from '../../../services/university/university.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  @ViewChild('profileCard') profileCard!: ElementRef;
  profile: Profile | null = null;
  isFriendAdded = false;
  isProfileSaved = false;

  universityMap: Map<string, string> = new Map();
  facultyMap: Map<string, string[]> = new Map();

  universityName: string = '';
  facultyName: string = '';

  constructor(
    private searchService: SearchService,
    private universityService: UniversityService
  ) {
    this.searchService.searchResults$.subscribe((result) => {
      if (result && !Array.isArray(result)) {
        this.profile = result as Profile;
        this.updateUniversityAndFaculty();
      }
    });
  }

  ngOnInit(): void {
    this.universityService.getUniversities().subscribe(universities => {
      universities.forEach(uni => {
        this.universityMap.set(uni.value, uni.label);
      });
      this.updateUniversityAndFaculty();
    });
  }

  private updateUniversityAndFaculty(): void {
    if (!this.profile) return;

    const uniValue = this.profile.usersData.universityName;
    this.universityName = this.universityMap.get(uniValue) || uniValue;

    this.universityService.loadFaculties(uniValue);
    this.universityService.faculties$.subscribe(faculties => {
      const faculty = faculties.find(f => f.label === this.profile?.faculty);
      this.facultyName = faculty?.label || this.profile?.faculty || '';
    });
  }

  get genderDisplay(): string {
    return this.profile?.usersData.gender ? 'Férfi' : 'Nő';
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