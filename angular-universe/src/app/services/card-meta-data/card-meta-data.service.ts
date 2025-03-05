import { Injectable } from '@angular/core';
import * as piexifjs from 'piexifjs';
import html2canvas from 'html2canvas';
import { PopupService } from '../popup-message/popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class CardMetadataService {

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
            userComment = userComment.replace("ASCII\0\0\0", "");

            const match = userComment.match(/usernameIn: (.*?), passwordIn: (.*)/);

            if (match) {
              const result = {
                username: match[1],
                password: match[2],
              };
              resolve(result);
            } else {
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

        const userCommentPrefix = 'ASCII\0\0\0';
        const userCommentValue = `${userCommentPrefix}usernameIn: ${userData.username}, passwordIn: ${userData.password}`;
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
}
