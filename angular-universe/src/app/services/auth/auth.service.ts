import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(this.getStoredLoginStatus());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  private cachedValues = new Map<string, string>();
  private authKeys = ['isLoggedIn', 'username', 'password'];
  private pollingActive = true;

  constructor(private router: Router) {
    this.isLoggedIn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.startPolling();
      } else {
        this.stopPolling();
        this.clearUserData();
      }
    });

    // Only update cache on service creation, but don't start polling yet
    this.updateValueCache();
  }

  private startPolling(): void {
    if (!this.pollingActive) {
      this.pollingActive = true;

      // Listen for storage changes across tabs
      window.addEventListener('storage', (event) => this.handleStorageEvent(event));

      // Poll for local changes (e.g., devtools modifications)
      interval(500)
        .pipe(takeWhile(() => this.pollingActive))
        .subscribe(() => this.checkStorageChanges());
    }
  }


  stopPolling(): void {
    this.pollingActive = false;
    window.removeEventListener('storage', (event) => this.handleStorageEvent(event));
  }

  private updateValueCache(): void {
    this.authKeys.forEach(key => {
      this.cachedValues.set(key, localStorage.getItem(key) || '');
    });
  }

  private handleStorageEvent(event: StorageEvent): void {
    if (this.authKeys.includes(event.key!)) {
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

  login(username: string, password: string): void {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    localStorage.removeItem('registrationFormData');

    this.isLoggedIn.next(true);
    this.updateValueCache();

    // Delay polling start to avoid false detections
    setTimeout(() => this.startPolling(), 5000);
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    this.clearUserData();
    this.isLoggedIn.next(false);
  }

  getLoginStatus(): boolean {
    return this.getStoredLoginStatus();
  }

  getStoredCredentials(): { username: string, password: string } | null {
    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');
    return (username && password) ? { username, password } : null;
  }
}
