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
    window.addEventListener('storage', () => this.checkAndUpdateLoginStatus());
    
    this.checkAndUpdateLoginStatus();
    
    this.isLoggedIn.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.clearUserData();
      }
    });
  }

  private getStoredLoginStatus(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true' && !!localStorage.getItem('username');
  }
  
  private checkAndUpdateLoginStatus(): void {
    const validLoginStatus = this.getStoredLoginStatus();
    
    if (this.isLoggedIn.value && !validLoginStatus) {
      this.isLoggedIn.next(false);
      this.router.navigate(['/UNIcard-login']);
    } else {
      this.isLoggedIn.next(validLoginStatus);
    }
  }
  
  private clearUserData(): void {
    localStorage.removeItem('username');
  }

  login(): void {
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedIn.next(true);
  }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    this.clearUserData();
    this.isLoggedIn.next(false);
  }

  getLoginStatus(): boolean {
    return this.getStoredLoginStatus();
  }
}