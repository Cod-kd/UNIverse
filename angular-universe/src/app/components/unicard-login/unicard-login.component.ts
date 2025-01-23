import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import * as piexifjs from 'piexifjs';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-unicard-login',
  standalone: true,
  imports: [ButtonComponent, FormsModule],
  templateUrl: './unicard-login.component.html',
  styleUrl: './unicard-login.component.css',
})
export class UNIcardLoginComponent {
  selectedFile: File | null = null;
  private loginService = inject(LoginService);

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
      const credentials = await this.readCardMetadata(this.selectedFile);

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

  private async readCardMetadata(
    file: File
  ): Promise<{ username: string; password: string } | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const base64Data = event.target?.result as string;

          // Load existing EXIF data
          const exifData = piexifjs.load(base64Data);
          const exif = exifData["Exif"] || {};

          // Extract the UserComment metadata if it exists
          const userCommentTag = 37510; // Tag number for UserComment
          let userComment = exif[userCommentTag];

          if (userComment) {
            // Remove the ASCII prefix
            userComment = userComment.replace("ASCII\0\0\0", "");

            // Updated pattern to match the actual format
            const match = userComment.match(/usernameIn: (.*?), passwordIn: (.*)/);

            if (match) {
              const result = {
                username: match[1],
                password: match[2],
              };
              resolve(result);
            } else {
              console.error('No credential pattern found in comment');
              resolve(null);
            }
          } else {
            console.error('No UserComment metadata found');
            resolve(null);
          }
        } catch (error) {
          console.error('Error in metadata processing:', error);
          reject(error);
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        reject(new Error('Failed to read file'));
      };

      reader.readAsDataURL(file);
    });
  }

  backToCredentialLogin() {
    this.router.navigate(['/login']);
  }

  backToRegistration() {
    this.router.navigate(['/registration']);
  }
}