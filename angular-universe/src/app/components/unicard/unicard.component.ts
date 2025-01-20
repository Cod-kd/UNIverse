import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import html2canvas from 'html2canvas';
import * as piexifjs from 'piexifjs';

interface UserData {
  email: string;
  username: string;
  gender: string;
  birthDate: string;
  university: string;
  faculty: string;
}

@Component({
  selector: 'app-unicard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './unicard.component.html',
  styleUrl: './unicard.component.css'
})
export class UNIcardComponent {
  userData: UserData = history.state.userData;

  saveUniCard = async () => {
    const userDataDiv = document.getElementById("userDataDiv");
    if (!userDataDiv) {
      console.error('User data div not found.');
      return;
    }

    try {
      // Capture div as canvas
      const canvas = await html2canvas(userDataDiv);
      const base64Image = canvas.toDataURL("image/jpeg", 0.95);
      console.log('Canvas captured:', !!base64Image);

      // Add EXIF metadata
      const exifData = piexifjs.load(base64Image);
      const userComment = `userData: ${JSON.stringify(this.userData)}`;
      const encodedComment = this.encodeToExifFormat(userComment);
      exifData.Exif[37510] = encodedComment;

      console.log('EXIF metadata added:', userComment);

      // Create downloadable image
      const exifBytes = piexifjs.dump(exifData);
      const imageWithExif = piexifjs.insert(exifBytes, base64Image);

      // Validate the image with EXIF
      if (!imageWithExif.startsWith("data:image/jpeg")) {
        console.error("Invalid image data after inserting EXIF metadata.");
        return;
      }

      const blob = this.dataURItoBlob(imageWithExif);

      // Trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `${this.userData.username}-UNIcard.jpg`;
      link.href = url;
      link.click();

      console.log('Download triggered:', link.download);

    } catch (err) {
      console.error('UNIcard save failed:', err);
    }
  };

  private encodeToExifFormat(comment: string): string {
    // EXIF UserComment must be ASCII-encoded and followed by the comment
    const prefix = "ASCII\0\0\0";

    // Convert the string to a UTF-8 byte array
    const utf8Bytes = new TextEncoder().encode(comment);

    // Create a buffer that includes the prefix + encoded comment
    const allBytes = new Uint8Array(prefix.length + utf8Bytes.length);
    allBytes.set(new TextEncoder().encode(prefix), 0);
    allBytes.set(utf8Bytes, prefix.length);

    // Convert to base64
    return this.bytesToBase64(allBytes);
  }

  private bytesToBase64(bytes: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

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
