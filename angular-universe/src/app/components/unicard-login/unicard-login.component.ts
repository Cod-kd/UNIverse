import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { CardMetadataService } from '../../services/card-meta-data.service';

@Component({
  selector: 'app-unicard-login',
  standalone: true,
  imports: [ButtonComponent, FormsModule],
  templateUrl: './unicard-login.component.html',
  styleUrls: ['./unicard-login.component.css'],
})
export class UNIcardLoginComponent {
  selectedFile: File | null = null;
  private loginService = inject(LoginService);
  private cardMetadataService = inject(CardMetadataService);

  constructor(private router: Router) { }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async loginWithCard(event: Event) {
    event.preventDefault();

    if (!this.selectedFile) {
      console.error('Kérlek, válassz ki egy UNIcard képet.');
      return;
    }

    try {
      const credentials = await this.cardMetadataService.readCardMetadata(this.selectedFile);

      if (credentials) {
        const { username, password } = credentials;
        if (username && password) {
          this.loginService.fetchLogin(username, password).subscribe({
            next: (response) => {
              this.loginService.handleLoginResponse(response, credentials);
            },
            error: (err) => {
              this.loginService.handleError(err);
            }
          });
        }
      } else {
        console.error('Nem található bejelentkezési adat a kártyán.');
      }
    } catch (error) {
      console.error('Hiba történt a kártya beolvasása közben. Kérlek, próbáld újra.');
    }
  }


  backToCredentialLogin() {
    this.router.navigate(['/login']);
  }

  backToRegistration() {
    this.router.navigate(['/registration']);
  }
}