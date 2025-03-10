import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DecoderService {

  // List of alphanumeric characters and special characters used during encoding
  private allChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{}|;:,.<>?/`~';

  constructor() {}

  // Generate Fibonacci sequence for given length
  private generateFibonacci(n: number): number[] {
    const fibSequence = [0, 1];
    for (let i = 2; i < n; i++) {
      fibSequence.push(fibSequence[i - 1] + fibSequence[i - 2]);
    }
    return fibSequence;
  }

  // Reverse the Fibonacci-based shift for a single character
  private shiftCharReverse(c: string, shiftValue: number): string {
    const index = this.allChars.indexOf(c);
    if (index === -1) {
      return c; // In case the character is not found (shouldn't happen with valid input)
    }
    const newIndex = (index - shiftValue + this.allChars.length) % this.allChars.length;
    return this.allChars[newIndex];
  }

  // Decode the encoded string
  private decodeString(encodedString: string): string {
    const fibSequence = this.generateFibonacci(encodedString.length);
    let decodedString = '';

    for (let i = 0; i < encodedString.length; i++) {
      const shiftValue = fibSequence[i] + (i + 1); // Fibonacci + (i+1)
      decodedString += this.shiftCharReverse(encodedString[i], shiftValue);
    }

    return decodedString;
  }

  // Decode the username and password from the URL
  public decodeFromUrl(url: string): Observable<{ username: string, password: string }> {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    const encodedUsername = urlParams.get('x1');
    const encodedPassword = urlParams.get('x2');

    if (encodedUsername && encodedPassword) {
      const decodedUsername = this.decodeString(encodedUsername);
      const decodedPassword = this.decodeString(encodedPassword);
      return of({ username: decodedUsername, password: decodedPassword });
    } else {
      return of({ username: '', password: '' });
    }
  }
}