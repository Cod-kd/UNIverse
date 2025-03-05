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
  private readonly STORAGE_KEY = 'appTheme';
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
  private initialized = false;

  constructor(private popupService: PopupService) { }

  loadTheme(): ThemeVariables {
    const savedTheme = localStorage.getItem(this.STORAGE_KEY);

    if (savedTheme) {
      try {
        const themeVars = JSON.parse(savedTheme);
        this.applyTheme(themeVars);
      } catch (e) {
        this.popupService.showError(`Theme loading failed ${e}`);
        this.applyTheme(this.defaultTheme);
      }
    } else {
      this.applyTheme(this.defaultTheme);
    }

    this.initialized = true;
    return this.themeSubject.value;
  }

  getCurrentTheme(): ThemeVariables {
    if (!this.initialized) {
      this.loadTheme();
    }
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
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedTheme));
  }

  applyTheme(theme: ThemeVariables): void {
    Object.entries(theme).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value);
    });
    this.themeSubject.next({ ...theme });
  }

  saveTheme(theme: ThemeVariables): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(theme));
    this.applyTheme(theme);
  }

  resetToDefault(): void {
    this.applyTheme(this.defaultTheme);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultTheme));
  }
}