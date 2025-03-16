import { Component } from '@angular/core';
import { ButtonComponent } from '../../general-components/button/button.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login/login.service';
import { CardMetadataService } from '../../../services/card-meta-data/card-meta-data.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-unicard-login',
  standalone: true,
  imports: [ButtonComponent, FormsModule],
  templateUrl: './unicard-login.component.html',
  styleUrls: ['./unicard-login.component.css'],
})
export class UNIcardLoginComponent {
  selectedFile: File | null = null;
  isLoginDisabled = true;

  constructor(
    private router: Router,
    private popupService: PopupService,
    private cardMetadataService: CardMetadataService,
    private loginService: LoginService,
    private authService: AuthService) { }

  ngOnInit(): void {
    // Check if user is already logged in with JWT
    if (this.authService.getLoginStatus()) {
      this.router.navigate(['/main-site']);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.isLoginDisabled = false;
    }
  }

  async loginWithCard(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) {
      this.popupService.showError('Kérlek, válaszd ki a UNIcard-od!');
      return;
    }

    try {
      const credentials = await this.cardMetadataService.readCardMetadata(this.selectedFile);

      if (credentials) {
        const { username, password } = credentials;
        if (username && password) {
          this.loginService.handleLoginResponse({ username, password });
        }
      } else {
        this.popupService.showError('Nem található bejelentkezési adat a kártyán.');
      }
    } catch (error) {
      this.popupService.showError('Hiba történt a kártya beolvasása közben.');
    }
  }

  backToCredentialLogin = () => this.router.navigate(['/login']);
  backToRegistration = () => this.router.navigate(['/registration']);
}