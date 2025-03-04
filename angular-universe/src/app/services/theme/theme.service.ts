import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PopupService } from '../popup-message/popup-message.service';

export interface ThemeVariables {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly STORAGE_KEY_PREFIX = 'appTheme';
  private defaultTheme: ThemeVariables = {
    '--main': '#FF5A1F',
    '--link': '#5D3FD3',
    '--dark1': '#343434',
    '--dark2': '#141414',
    '--light1': '#FFF0EB',
    '--light2': '#FFD2C2'
  };

  private themeSubject = new BehaviorSubject<ThemeVariables>(this.defaultTheme);
  currentTheme$ = this.themeSubject.asObservable();

  private currentUserId: string | null = null;

  constructor(private popupService: PopupService) {
    this.loadTheme();
  }

  setUser(userId: string | null): void {
    this.currentUserId = userId;
    this.loadTheme();
  }

  private getStorageKey(): string {
    return this.currentUserId
      ? `${this.STORAGE_KEY_PREFIX}_${this.currentUserId}`
      : this.STORAGE_KEY_PREFIX;
  }

  loadTheme(): void {
    const storageKey = this.getStorageKey();
    const savedTheme = localStorage.getItem(storageKey);

    if (savedTheme) {
      try {
        const themeVars = JSON.parse(savedTheme);
        this.applyTheme(themeVars);
      } catch (e) {
        this.popupService.show('Failed to parse saved theme.');
        this.applyTheme(this.defaultTheme);
      }
    } else {
      this.applyTheme(this.defaultTheme);
    }
  }

  getCurrentTheme(): ThemeVariables {
    return this.themeSubject.getValue();
  }

  getDefaultTheme(): ThemeVariables {
    return { ...this.defaultTheme };
  }

  updateVariable(variable: string, value: string): void {
    document.documentElement.style.setProperty(variable, value);
    const currentTheme = this.themeSubject.getValue();
    const updatedTheme = { ...currentTheme, [variable]: value };

    this.themeSubject.next(updatedTheme);
    localStorage.setItem(this.getStorageKey(), JSON.stringify(updatedTheme));
  }

  applyTheme(theme: ThemeVariables): void {
    Object.entries(theme).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value);
    });
    this.themeSubject.next({ ...theme });
  }

  saveTheme(theme: ThemeVariables): void {
    localStorage.setItem(this.getStorageKey(), JSON.stringify(theme));
    this.applyTheme(theme);
  }

  resetToDefault(): void {
    this.applyTheme(this.defaultTheme);
    localStorage.removeItem(this.getStorageKey());
  }

  clearUserTheme(): void {
    this.currentUserId = null;
    this.loadTheme();
  }
}