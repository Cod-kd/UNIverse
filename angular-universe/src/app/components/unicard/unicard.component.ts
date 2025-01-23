import { Component } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import html2canvas from 'html2canvas';
import * as piexifjs from 'piexifjs';
import { Router } from '@angular/router';

interface UserData {
  email: string;
  username: string;
  gender: string;
  birthDate: string;
  university: string;
  faculty: string;
  password: string;
}

@Component({
  selector: 'app-unicard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './unicard.component.html',
  styleUrl: './unicard.component.css',
})
export class UNIcardComponent {
  userData: UserData = history.state.userData;

  constructor(private router: Router) {}

  saveUniCard = async () => {
    const userDataDiv = document.getElementById('userDataDiv');
    if (!userDataDiv) {
      console.error('User data div not found.');
      return;
    }

    try {
      // Capture div as canvas
      const canvas = await html2canvas(userDataDiv, { backgroundColor: null });
      const base64Image = canvas.toDataURL('image/jpeg', 0.95);

      try {
        // Add EXIF metadata
        const exifData = piexifjs.load(base64Image);
        const zeroth = exifData['0th'] || {};
        const exif = exifData['Exif'] || {};
        const gps = exifData['GPS'] || {};

        const userComment = `userData: ${JSON.stringify(this.userData)}`;
        const userCommentTag = 37510; // Tag number for UserComment
        const userCommentPrefix = 'ASCII\0\0\0'; // Prefix for ASCII encoding
        const userCommentValue = `${userCommentPrefix}usernameIn: ${this.userData.username}, passwordIn: ${this.userData.password}`;
        exif[userCommentTag] = userCommentValue;

        const exifBytes = piexifjs.dump({
          '0th': zeroth,
          Exif: exif,
          GPS: gps,
        });

        // Insert EXIF into the base64 image
        const newImageData = piexifjs.insert(exifBytes, base64Image);

        // Convert modified image to Blob
        const newBlob = this.dataURItoBlob(newImageData);

        // Create a download link for the modified image
        const link = document.createElement('a');
        link.download = `${this.userData.username}-UNIcard.jpg`;
        link.href = URL.createObjectURL(newBlob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.router.navigate(["/UNIcard-login"]);
      } catch (err) {
        console.error('Error: ', err);
      }
    } catch (err) {
      console.error('UNIcard save failed:', err);
    }
  };

  private dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const arrayBuffer = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      arrayBuffer[i] = byteString.charCodeAt(i);
    }
    return new Blob([arrayBuffer], { type: mimeString });
  }
}
