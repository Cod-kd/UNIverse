import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface StoredCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(this.hasValidToken());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  private hasValidToken(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  login(token: string, userId: string): void {
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('userId', userId);
    this.isLoggedIn.next(true);
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('userId');
    localStorage.removeItem('temp_credentials');
    this.isLoggedIn.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  getLoginStatus(): boolean {
    return this.hasValidToken();
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }

  // Store credentials temporarily until card is downloaded
  storeCredentialsTemporarily(username: string, password: string): void {
    const credentials: StoredCredentials = { username, password };
    localStorage.setItem('temp_credentials', btoa(JSON.stringify(credentials)));
  }

  getStoredCredentials(): StoredCredentials | null {
    const storedData = localStorage.getItem('temp_credentials');
    if (!storedData) return null;

    try {
      return JSON.parse(atob(storedData)) as StoredCredentials;
    } catch {
      return null;
    }
  }

  clearStoredCredentials(): void {
    localStorage.removeItem('temp_credentials');
  }
}