import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.getStoredAuthStatus());
  isAuthenticated$ = this.isAuthenticated.asObservable();

  private cachedValues = new Map<string, string>();
  private authKeys = ['token', 'username', 'userId']; // Keys to monitor
  private pollingActive = false;
  private pollingSubscription?: Subscription;
  private isInitialLogin = false; // Flag for initial login

  constructor(private router: Router) {
    this.isAuthenticated.subscribe(isAuth => {
      if (isAuth) {
        this.startPolling();
      } else {
        this.stopPolling();
        this.clearUserData();
      }
    });

    this.updateValueCache();
  }

  private startPolling(): void {
    if (this.pollingActive) return;

    this.pollingActive = true;

    // If this is an initial login, update the cache before starting to poll
    if (this.isInitialLogin) {
      this.updateValueCache();
      this.isInitialLogin = false;
    }

    this.pollingSubscription = interval(500)
      .pipe(takeWhile(() => this.pollingActive))
      .subscribe(() => this.checkStorageChanges());
  }

  stopPolling(): void {
    this.pollingActive = false;
    this.pollingSubscription?.unsubscribe();
  }

  private updateValueCache(): void {
    this.authKeys.forEach(key => {
      this.cachedValues.set(key, localStorage.getItem(key) || '');
    });
  }

  private checkStorageChanges(): void {
    if (!this.pollingActive) return;

    for (const key of this.authKeys) {
      const currentValue = localStorage.getItem(key) || '';
      if (currentValue !== this.cachedValues.get(key)) {
        console.log(`Storage change detected: ${key}`);
        this.logoutAndRedirect();
        return;
      }
    }
  }

  private logoutAndRedirect(): void {
    this.stopPolling();
    this.isAuthenticated.next(false);
    this.router.navigate(['/UNIcard-login']);
  }

  private getStoredAuthStatus(): boolean {
    // Check if token and username are present
    return !!localStorage.getItem('token') &&
      !!localStorage.getItem('username');
  }

  private clearUserData(): void {
    this.authKeys.forEach(key => localStorage.removeItem(key));
    this.updateValueCache();
  }

  login(username: string, token: string, userId: string): void {
    // Set flag to indicate initial login
    this.isInitialLogin = true;

    // Update localStorage values
    localStorage.setItem('username', username);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.removeItem("registrationFormData");

    // Update authentication state
    this.isAuthenticated.next(true);
  }

  logout(): void {
    this.stopPolling();
    this.clearUserData();
    localStorage.removeItem("registrationFormData");
    this.isAuthenticated.next(false);
  }

  getAuthStatus(): boolean {
    return this.getStoredAuthStatus();
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUserId(): string | null {
    return localStorage.getItem('userId');
  }
}