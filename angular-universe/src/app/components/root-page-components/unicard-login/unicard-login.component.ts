import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../general-components/button/button.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login/login.service';
import { CardMetadataService } from '../../../services/card-meta-data/card-meta-data.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { SvgAnimationComponent } from "../../general-components/svg-animation/svg-animation.component";

@Component({
  selector: 'app-unicard-login',
  standalone: true,
  imports: [ButtonComponent, FormsModule, SvgAnimationComponent],
  templateUrl: './unicard-login.component.html',
  styleUrls: ['./unicard-login.component.css'],
})
export class UNIcardLoginComponent {
  selectedFile: File | null = null;
  private loginService = inject(LoginService);
  private cardMetadataService = inject(CardMetadataService);

  constructor(private router: Router, private popupService: PopupService) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async loginWithCard(event: Event) {
    event.preventDefault();
    if (!this.selectedFile) {
      this.popupService.show('Kérlek, válassz ki egy UNIcard képet.');
      return;
    }

    try {
      const credentials = await this.cardMetadataService.readCardMetadata(this.selectedFile);

      if (credentials) {
        const { username, password } = credentials;
        if (username && password) {
          this.loginService.fetchLogin(username, password).subscribe({
            next: () => {
              this.loginService.handleLoginResponse(credentials);
            },
            error: (err) => {
              this.loginService.handleError(err);
            }
          });
        }
      } else {
        this.popupService.show('Nem található bejelentkezési adat a kártyán.');
      }
    } catch (error) {
      this.popupService.show('Hiba történt a kártya beolvasása közben. Kérlek, próbáld újra.');
    }
  }


  backToCredentialLogin() {
    this.router.navigate(['/login']);
  }

  backToRegistration() {
    this.router.navigate(['/registration']);
  }
}