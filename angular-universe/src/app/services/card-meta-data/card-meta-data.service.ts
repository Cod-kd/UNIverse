import { Injectable } from '@angular/core';
import * as piexifjs from 'piexifjs';
import html2canvas from 'html2canvas';
import { PopupService } from '../popup-message/popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class CardMetadataService {
  // Change encryption key
  private readonly encryptionKey = 'UNI-SECURE-KEY-2025';

  constructor(private popupService: PopupService) { }

  async readCardMetadata(file: File): Promise<{ username: string; password: string } | null> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const base64Data = event.target?.result as string;
          const exifData = piexifjs.load(base64Data);
          const exif = exifData["Exif"] || {};
          const userCommentTag = 37510;
          let userComment = exif[userCommentTag];

          if (userComment) {
            // Remove ASCII prefix
            userComment = userComment.replace("ASCII\0\0\0", "");

            try {
              // Decrypt the data
              const decryptedData = this.decrypt(userComment);
              const match = decryptedData.match(/usernameIn: (.*?), passwordIn: (.*)/);

              if (match) {
                const result = {
                  username: match[1],
                  password: match[2],
                };
                resolve(result);
              } else {
                resolve(null);
              }
            } catch (decryptError) {
              this.popupService.showError('A kártya adatai nem olvashatók: hibás vagy nem titkosított formátum.');
              resolve(null);
            }
          } else {
            resolve(null);
          }
        } catch (error: any) {
          reject(error);
        }
      };

      reader.onerror = (error) => {
        this.popupService.showError('Sikertelen beolvasás: ' + error);
        reject(new Error('Sikertelen beolvasás!'));
      };

      reader.readAsDataURL(file);
    });
  }

  async saveCardData(userData: any, userDataDiv: HTMLElement): Promise<void> {
    try {
      const canvas = await html2canvas(userDataDiv, { backgroundColor: null });
      const base64Image = canvas.toDataURL('image/jpeg', 0.95);

      try {
        const exifData = piexifjs.load(base64Image);
        const zeroth = exifData['0th'] || {};
        const exif = exifData['Exif'] || {};
        const gps = exifData['GPS'] || {};

        // Create the user data string
        const userDataString = `usernameIn: ${userData.username}, passwordIn: ${userData.password}`;

        // Encrypt the data
        const encryptedData = this.encrypt(userDataString);

        // Add ASCII prefix required by the EXIF standard
        const userCommentPrefix = 'ASCII\0\0\0';
        const userCommentValue = `${userCommentPrefix}${encryptedData}`;
        const userCommentTag = 37510;
        exif[userCommentTag] = userCommentValue;

        const exifBytes = piexifjs.dump({
          '0th': zeroth,
          Exif: exif,
          GPS: gps,
        });

        const newImageData = piexifjs.insert(exifBytes, base64Image);
        const newBlob = this.dataURItoBlob(newImageData);

        const link = document.createElement('a');
        link.download = `${userData.username}-UNIcard.jpg`;
        link.href = URL.createObjectURL(newBlob);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

      } catch (err: any) {
        this.popupService.showError('Hiba adatkiolvasás közben: ' + err.message);
        throw new Error('Hiba adatkiolvasás közben!');
      }
    } catch (err: any) {
      this.popupService.showError('Hiba adatkezelés közben: ' + err.message);
      throw new Error('Hiba adatkezelés közben!');
    }
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

  // Simple XOR encryption
  private encrypt(text: string): string {
    // Convert to Base64 first to handle special characters
    const base64 = btoa(text);
    let result = '';

    for (let i = 0; i < base64.length; i++) {
      // XOR each character with the corresponding character in the key
      const charCode = base64.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
      result += String.fromCharCode(charCode);
    }

    // Return as Base64 to ensure it can be stored in EXIF
    return btoa(result);
  }

  // Simple XOR decryption
  private decrypt(encryptedBase64: string): string {
    try {
      // Decode the outer Base64
      const encrypted = atob(encryptedBase64);
      let result = '';

      for (let i = 0; i < encrypted.length; i++) {
        // XOR each character with the corresponding character in the key
        const charCode = encrypted.charCodeAt(i) ^ this.encryptionKey.charCodeAt(i % this.encryptionKey.length);
        result += String.fromCharCode(charCode);
      }

      // Decode the inner Base64 to get the original text
      return atob(result);
    } catch (e) {
      throw new Error('Decryption failed');
    }
  }
}