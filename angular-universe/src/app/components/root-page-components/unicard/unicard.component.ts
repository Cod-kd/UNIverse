import { Component, OnInit, Input } from '@angular/core';
import { ButtonComponent } from '../../general-components/button/button.component';
import { Router } from '@angular/router';
import { CardMetadataService } from '../../../services/card-meta-data/card-meta-data.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { UniversityService } from '../../../services/university/university.service';
import { UserData } from '../../../models/unicard/unicard.model';
import { AuthService } from '../../../services/auth/auth.service';
import { FetchService } from '../../../services/fetch/fetch.service';
import { LoadingService } from '../../../services/loading/loading.service';
import { finalize } from 'rxjs/operators';
import { Profile } from '../../../models/profile/profile.model';

@Component({
  selector: 'app-unicard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './unicard.component.html',
  styleUrls: ['./unicard.component.css'],
})
export class UNIcardComponent implements OnInit {
  @Input() isCompactMode = false;
  userData: UserData = history.state.userData;

  universityName = '';
  facultyName = '';
  isLoading = false;

  constructor(
    private router: Router,
    private popupService: PopupService,
    private universityService: UniversityService,
    private authService: AuthService,
    private fetchService: FetchService,
    private loadingService: LoadingService,
    private cardMetadataService: CardMetadataService
  ) { }

  ngOnInit(): void {
    localStorage.removeItem('registrationFormData');

    if (this.userData?.username) {
      this.processUserData();
      return;
    }

    if (this.authService.getLoginStatus()) {
      this.fetchUserData();
    } else {
      this.router.navigate(['/UNIcard-login']);
    }
  }

  private fetchUserData(): void {
    const credentials = this.authService.getStoredCredentials();
    if (!credentials) {
      this.router.navigate(['/UNIcard-login']);
      return;
    }

    this.isLoading = true;
    this.loadingService.show();

    this.fetchService.get<Profile>(`/user/name/${credentials.username}`, {
      responseType: 'json',
      showError: true
    })
      .pipe(finalize(() => {
        this.loadingService.hide();
        this.isLoading = false;
      }))
      .subscribe({
        next: (profile) => {
          this.userData = {
            username: credentials.username,
            password: credentials.password,
            fullName: profile.usersData.name,
            gender: profile.usersData.gender === null ? '' : profile.usersData.gender ? '1' : '0',
            birthDate: profile.usersData.birthDate,
            university: profile.usersData.universityName,
            faculty: profile.faculty
          };
          this.processUserData();
        },
        error: () => {
          this.popupService.showError('Nem sikerült lekérni a felhasználói adatokat!');
          this.router.navigate(['/UNIcard-login']);
        }
      });
  }

  private processUserData(): void {
    this.universityName = this.universityService.getUniversityName(this.userData.university);
    this.facultyName = this.universityService.isFacultyValid(this.userData.university, this.userData.faculty)
      ? this.userData.faculty
      : this.userData.faculty;
  }

  saveUniCard = async () => {
    if (!this.userData?.username) {
      this.popupService.showError('Érvénytelen adatok!');
      this.router.navigate(['/UNIcard-login']);
      return;
    }

    const userDataDiv = document.getElementById('userDataDiv');
    if (!userDataDiv) {
      this.popupService.showError('UNIcard nem található!');
      return;
    }

    try {
      await this.cardMetadataService.saveCardData(this.userData, userDataDiv);
      if (!this.authService.getLoginStatus()) {
        this.router.navigate(['/UNIcard-login']);
      }
    } catch (error) {
      this.popupService.showError(`UNIcard mentése sikertelen: ${error}`);
    }
  };
}