import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(this.getStoredLoginStatus());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private router: Router) {
    this.checkAndUpdateLoginStatus();
    
    window.addEventListener('storage', () => {
      this.checkAndUpdateLoginStatus();
    });
  }

  private getStoredLoginStatus(): boolean {
    const storedLoginStatus = localStorage.getItem('isLoggedIn');
    const storedUsername = localStorage.getItem('username');
    return storedLoginStatus === 'true' && !!storedUsername;
  }
  
  private checkAndUpdateLoginStatus(): void {
    const isCurrentlyValid = this.getStoredLoginStatus();
    if (this.isLoggedIn.value && !isCurrentlyValid) {
      this.logout();
      this.router.navigate(['/UNIcard-login']);
    }
    
    this.isLoggedIn.next(isCurrentlyValid);
  }

  login() {
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedIn.next(true);
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('username');
    this.isLoggedIn.next(false);
  }

  getLoginStatus() {
    const currentStatus = this.getStoredLoginStatus();
    if (this.isLoggedIn.value !== currentStatus) {
      this.isLoggedIn.next(currentStatus);
    }
    
    return currentStatus;
  }
}