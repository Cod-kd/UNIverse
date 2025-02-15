import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AnimationService } from '../animation/animation.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedIn = new BehaviorSubject<boolean>(this.getStoredLoginStatus());
  isLoggedIn$ = this.isLoggedIn.asObservable();

  constructor(private animationService: AnimationService) {
    this.isLoggedIn.next(this.getStoredLoginStatus());
  }

  private getStoredLoginStatus(): boolean {
    const storedStatus = localStorage.getItem('isLoggedIn');
    return storedStatus === 'true';
  }

  login() {
    localStorage.setItem('isLoggedIn', 'true');
    this.isLoggedIn.next(true);
  }

  logout() {
    localStorage.setItem('isLoggedIn', 'false');
    this.isLoggedIn.next(false);
  }

  getLoginStatus() {
    return this.isLoggedIn.value;
  }
}