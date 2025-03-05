import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '../../general-components/button/button.component';
import { Router } from '@angular/router';
import { CardMetadataService } from '../../../services/card-meta-data/card-meta-data.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { UniversityService } from '../../../services/university/university.service';
import { UserData } from '../../../models/unicard/unicard.model';

@Component({
  selector: 'app-unicard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './unicard.component.html',
  styleUrls: ['./unicard.component.css'],
})
export class UNIcardComponent implements OnInit {
  // User data retrieved from navigation state or initialized as empty
  userData: UserData = history.state.userData || {} as UserData;
  private cardMetadataService = inject(CardMetadataService);

  // Display names for UI
  universityName: string = '';
  facultyName: string = '';

  constructor(
    private router: Router,
    private popupService: PopupService,
    private universityService: UniversityService
  ) { }

  ngOnInit(): void {
    // Clear any stored registration data
    localStorage.removeItem('registrationFormData');

    // Redirect if user data is missing
    if (!this.userData?.username) {
      this.router.navigate(['/UNIcard-login']);
      return;
    }

    // Retrieve university display name
    this.universityName = this.universityService.getUniversityName(this.userData.university);

    // Check if faculty is valid for the university, otherwise use default name
    if (this.universityService.isFacultyValid(this.userData.university, this.userData.faculty)) {
      this.facultyName = this.userData.faculty;
    } else {
      // If faculty isn't found, use original value
      this.facultyName = this.userData.faculty;
    }
  }

  // Save user UNIcard data
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
      // Save user data and navigate back to login
      await this.cardMetadataService.saveCardData(this.userData, userDataDiv);
      this.router.navigate(['/UNIcard-login']);
    } catch (error) {
      this.popupService.show(`UNIcard save failed: ${error}`);
    }
  };
}
