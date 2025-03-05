import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private encryptionKey: CryptoKey | null = null;

  private isLoggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedIn.asObservable();

  private cachedValues = new Map<string, string>();
  private authKeys = ['isLoggedIn', 'username', 'password'];
  private pollingActive = false;
  private pollingSubscription?: Subscription;
  private storageEventHandler = (event: StorageEvent) => this.handleStorageEvent(event);

  constructor(private router: Router) {
    this.initializeEncryptionKey().then(() => {
      this.isLoggedIn.next(this.getStoredLoginStatus());

      this.isLoggedIn.subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.startPolling();
        } else {
          this.stopPolling();
          this.clearUserData();
        }
      });
    });
  }

  private async initializeEncryptionKey(): Promise<void> {
    // Check if key exists in localStorage
    const storedKey = localStorage.getItem('encryptionKey');

    if (storedKey) {
      // Convert stored key back to CryptoKey
      this.encryptionKey = await this.importKey(storedKey);
    } else {
      // Generate new key if not exists
      this.encryptionKey = await this.generateKey();

      // Store key securely (consider more advanced key management in production)
      const exportedKey = await this.exportKey();
      localStorage.setItem('encryptionKey', exportedKey);
    }
  }

  private async generateKey(): Promise<CryptoKey> {
    return await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async exportKey(): Promise<string> {
    if (!this.encryptionKey) throw new Error('Encryption key not initialized');

    const exported = await window.crypto.subtle.exportKey('jwk', this.encryptionKey);
    return JSON.stringify(exported);
  }

  // Import key from stored format
  private async importKey(storedKey: string): Promise<CryptoKey> {
    const keyData = JSON.parse(storedKey);
    return await window.crypto.subtle.importKey(
      'jwk',
      keyData,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );
  }

  private async encrypt(data: string): Promise<string> {
    if (!this.encryptionKey) throw new Error('Encryption key not initialized');

    const encoder = new TextEncoder();
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv: iv },
      this.encryptionKey,
      encoder.encode(data)
    );

    // Combine IV and encrypted data
    const combined = new Uint8Array([...iv, ...new Uint8Array(encrypted)]);
    return btoa(String.fromCharCode.apply(null, Array.from(combined)));
  }

  // Decrypt data
  private async decrypt(encryptedData: string): Promise<string> {
    if (!this.encryptionKey) throw new Error('Encryption key not initialized');

    const combined = new Uint8Array(
      atob(encryptedData).split('').map(char => char.charCodeAt(0))
    );

    // Extract IV and encrypted data
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      this.encryptionKey,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  private async setEncryptedItem(key: string, value: string): Promise<void> {
    const encryptedValue = await this.encrypt(value);
    localStorage.setItem(key, encryptedValue);
  }

  // Securely get decrypted item from localStorage
  private async getDecryptedItem(key: string): Promise<string | null> {
    const encryptedValue = localStorage.getItem(key);
    return encryptedValue ? await this.decrypt(encryptedValue) : null;
  }

  private startPolling(): void {
    if (this.pollingActive) return;

    this.pollingActive = true;
    window.addEventListener('storage', this.storageEventHandler);

    this.pollingSubscription = interval(500)
      .pipe(takeWhile(() => this.pollingActive))
      .subscribe(() => this.checkStorageChanges());
  }

  stopPolling(): void {
    this.pollingActive = false;
    window.removeEventListener('storage', this.storageEventHandler);
    this.pollingSubscription?.unsubscribe();
  }

  private updateValueCache(): void {
    this.authKeys.forEach(key => {
      this.cachedValues.set(key, localStorage.getItem(key) || '');
    });
  }

  private handleStorageEvent(event: StorageEvent): void {
    if (event.key && this.authKeys.includes(event.key)) {
      this.logoutAndRedirect();
    }
  }

  private checkStorageChanges(): void {
    if (!this.pollingActive) return;

    for (const key of this.authKeys) {
      const currentValue = localStorage.getItem(key) || '';
      if (currentValue !== this.cachedValues.get(key)) {
        console.warn(`Storage change detected on key: ${key}`);
        this.logoutAndRedirect();
        return;
      }
    }
  }

  private logoutAndRedirect(): void {
    this.stopPolling();
    this.isLoggedIn.next(false);
    this.router.navigate(['/UNIcard-login']);
  }

  private getStoredLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true' &&
      !!localStorage.getItem('username') &&
      !!localStorage.getItem('password');
  }

  private clearUserData(): void {
    this.authKeys.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem("userId");
    this.updateValueCache();
  }

  async login(username: string, password: string): Promise<void> {
    await this.setEncryptedItem('isLoggedIn', 'true');
    await this.setEncryptedItem('username', username);
    await this.setEncryptedItem('password', password);

    localStorage.removeItem('registrationFormData');
    this.isLoggedIn.next(true);

    setTimeout(() => this.startPolling(), 500);
  }

  // Modified logout to clear encrypted data
  logout(): void {
    this.stopPolling();
    this.clearUserData();
    this.isLoggedIn.next(false);
  }

  async getLoginStatus(): Promise<boolean> {
    const isLoggedIn = await this.getDecryptedItem('isLoggedIn');
    const username = await this.getDecryptedItem('username');
    const password = await this.getDecryptedItem('password');

    return isLoggedIn === 'true' && !!username && !!password;
  }

  async getStoredCredentials(): Promise<{ username: string, password: string } | null> {
    const username = await this.getDecryptedItem('username');
    const password = await this.getDecryptedItem('password');
    return (username && password) ? { username, password } : null;
  }
}