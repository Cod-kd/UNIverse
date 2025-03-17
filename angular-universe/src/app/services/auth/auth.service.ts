import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { takeWhile } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private hasToken = new BehaviorSubject<boolean>(this.getStoredLoginStatus());
  hasToken$ = this.hasToken.asObservable();

  private cachedValues = new Map<string, string>();
  private authKeys = []; // Temporarily removed username
  private pollingActive = false;
  private pollingSubscription?: Subscription;
  //private storageEventHandler = (event: StorageEvent) => this.handleStorageEvent(event);

  constructor(
    private router: Router,
  ) {
    this.hasToken.subscribe(hasToken => {
      if (hasToken) {
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
    //window.addEventListener('storage', this.storageEventHandler);

    this.pollingSubscription = interval(500)
      .pipe(takeWhile(() => this.pollingActive))
      .subscribe(() => this.checkStorageChanges());
  }

  stopPolling(): void {
    this.pollingActive = false;
    //window.removeEventListener('storage', this.storageEventHandler);
    this.pollingSubscription?.unsubscribe();
  }

  private updateValueCache(): void {
    this.authKeys.forEach(key => {
      this.cachedValues.set(key, localStorage.getItem(key) || '');
    });
  }

  /*
  private handleStorageEvent(event: StorageEvent): void {
    if (event.key && this.authKeys.includes(event.key)) {
      this.logoutAndRedirect();
    }
  }
    */

  private checkStorageChanges(): void {
    if (!this.pollingActive) return;

    for (const key of this.authKeys) {
      const currentValue = localStorage.getItem(key) || '';
      if (currentValue !== this.cachedValues.get(key)) {
        this.logoutAndRedirect();
        return;
      }
    }
  }

  private logoutAndRedirect(): void {
    this.stopPolling();
    this.hasToken.next(false);
    this.router.navigate(['/UNIcard-login']);
  }

  private getStoredLoginStatus(): boolean {
    return localStorage.getItem('hasToken') === 'true' &&
      !!localStorage.getItem('username') &&
      !!localStorage.getItem('password');
  }

  private clearUserData(): void {
    this.authKeys.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem("userId");
    this.updateValueCache();
  }

  login(username: string, password: string): void {
    localStorage.setItem('hasToken', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('password', password);
    this.hasToken.next(true);
    this.updateValueCache();
    setTimeout(() => this.startPolling(), 500);
  }

  logout(): void {
    this.stopPolling();
    localStorage.setItem('hasToken', 'false');
    this.clearUserData();
    this.hasToken.next(false);
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