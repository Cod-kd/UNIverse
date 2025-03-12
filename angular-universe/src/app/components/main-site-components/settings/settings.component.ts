import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../../services/theme/theme.service';
import { ThemeColor } from '../../../models/theme/theme.model';
import { ButtonComponent } from '../../general-components/button/button.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy {
  themeColors: ThemeColor[] = [
    { name: 'Main', cssVar: '--main', value: '#FF5A1F', label: 'Oldal fő színe' },
    { name: 'Link', cssVar: '--link', value: '#5D3FD3', label: 'Linkek színe' },
    { name: 'Dark 1', cssVar: '--dark1', value: '#343434', label: 'Sötét árnyalat 1' },
    { name: 'Dark 2', cssVar: '--dark2', value: '#141414', label: 'Sötét árnyalat 2' },
    { name: 'Light 1', cssVar: '--light1', value: '#FFF0EB', label: 'Világos árnyalat 1' },
    { name: 'Light 2', cssVar: '--light2', value: '#666666', label: 'Világos árnyalat 2' },
  ];

  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.loadCurrentThemeValues();

    this.themeSubscription = this.themeService.currentTheme$.subscribe(theme => {
      this.updateLocalThemeColors(theme);
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  private loadCurrentThemeValues(): void {
    const currentTheme = this.themeService.getCurrentTheme();
    this.updateLocalThemeColors(currentTheme);
  }

  private updateLocalThemeColors(theme: { [key: string]: string }): void {
    this.themeColors.forEach(color => {
      if (theme[color.cssVar]) {
        color.value = theme[color.cssVar];
      }
    });
  }

  onColorChange(color: ThemeColor): void {
    this.themeService.updateVariable(color.cssVar, color.value);

    const fullTheme = this.themeColors.reduce((theme, colorItem) => {
      theme[colorItem.cssVar] = colorItem.value;
      return theme;
    }, {} as { [key: string]: string });

    this.themeService.saveTheme(fullTheme);
  }

  resetChanges(): void {
    this.themeService.resetToDefault();
  }
}