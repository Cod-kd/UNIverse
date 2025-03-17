import { Component } from '@angular/core';
import { ButtonComponent } from '../../general-components/button/button.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login/login.service';
import { CardMetadataService } from '../../../services/card-meta-data/card-meta-data.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';

@Component({
  selector: 'app-unicard-login',
  standalone: true,
  imports: [ButtonComponent, FormsModule],
  templateUrl: './unicard-login.component.html',
  styleUrls: ['./unicard-login.component.css'],
})
export class UNIcardLoginComponent {
  selectedFile: File | null = null; // Stores selected UNIcard file
  isLoginDisabled = true; // Disables login button until a file is selected

  constructor(
    private router: Router,
    private popupService: PopupService,
    private cardMetadataService: CardMetadataService,
    private loginService: LoginService) { }

  // Handles file selection for login
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.isLoginDisabled = false; // Enable login button
    }
  }

  // Attempts login using the selected UNIcard file
  async loginWithCard(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) {
      this.popupService.showError('Kérlek, válaszd ki a UNIcard-od!');
      return;
    }

    try {
      // Read credentials from UNIcard metadata
      const credentials = await this.cardMetadataService.readCardMetadata(this.selectedFile);

      if (credentials) {
        const { username, password } = credentials;
        if (username && password) {
          // Authenticate using fetched credentials
          this.loginService.fetchLogin(username, password).subscribe({
            next: (token: string) => {
              if (token) {
                this.loginService.handleLoginResponse({ username }, token);
              } else {
                this.popupService.showError("Érvénytelen token!");
              }
            }
          });
        }
      } else {
        this.popupService.showError('Nem található bejelentkezési adat a kártyán.');
      }
    } catch (error) {
      this.popupService.showError('Hiba történt a kártya beolvasása közben.');
    }
  }

  // Navigate back to traditional credential login page
  backToCredentialLogin() {
    this.router.navigate(['/login']);
  }

  // Navigate back to registration page
  backToRegistration() {
    this.router.navigate(['/registration']);
  }
}