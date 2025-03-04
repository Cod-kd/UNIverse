import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../general-components/button/button.component';
import { Router } from '@angular/router';
import { CardMetadataService } from '../../../services/card-meta-data/card-meta-data.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { UniversityService } from '../../../services/university/university.service';

interface UserData {
  email: string;
  username: string;
  fullName: string;
  gender: string;
  birthDate: string;
  university: string; // Stores university code (e.g., "BME")
  faculty: string;    // Stores faculty name or code
  password: string;
}

@Component({
  selector: 'app-unicard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './unicard.component.html',
  styleUrls: ['./unicard.component.css'],
})
export class UNIcardComponent implements OnInit {
  userData: UserData = history.state.userData || {} as UserData;
  private cardMetadataService = inject(CardMetadataService);
  
  // Display names for UI
  universityName: string = '';
  facultyName: string = '';

  constructor(
    private router: Router, 
    private popupService: PopupService,
    private universityService: UniversityService
  ) {}

  ngOnInit(): void {
    localStorage.removeItem('registrationFormData');
    
    if (!this.userData?.username) {
      this.router.navigate(['/UNIcard-login']);
      return;
    }
    
    // Get display names for university and faculty
    this.universityName = this.universityService.getUniversityName(this.userData.university);
    
    // Check if faculty is a valid name for this university, otherwise show as-is
    if (this.universityService.isFacultyValid(this.userData.university, this.userData.faculty)) {
      this.facultyName = this.userData.faculty; // It's already the full name
    } else {
      // Try to find faculty by matching with the faculties for this university
      const faculties = this.universityService.getFacultyList(this.userData.university);
      // Default to original value if no match found
      this.facultyName = this.userData.faculty;
    }
  }

  saveUniCard = async () => {
    if (!this.userData?.username) {
      this.popupService.show('Invalid user data');
      this.router.navigate(['/UNIcard-login']);
      return;
    }

    const userDataDiv = document.getElementById('userDataDiv');
    if (!userDataDiv) {
      this.popupService.show('UNIcard not found.');
      return;
    }

    try {
      await this.cardMetadataService.saveCardData(this.userData, userDataDiv);
      this.router.navigate(['/UNIcard-login']);
    } catch (error) {
      this.popupService.show(`UNIcard save failed: ${error}`);
    }
  };
}