import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBarComponent } from '../../general-components/search-bar/search-bar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { DatePipe, NgIf } from '@angular/common';
import { ButtonComponent } from "../../general-components/button/button.component";
import { FormsModule } from '@angular/forms';

interface BaseShortcut {
  id: string;
  name: string;
}

interface WebsiteShortcut extends BaseShortcut {
  type: 'website';
  url: string;
}

interface UNInoteShortcut extends BaseShortcut {
  type: 'uninote';
  description: string;
  startTime: Date;
  completed: boolean;
}

type Shortcut = WebsiteShortcut | UNInoteShortcut;

interface ShortcutFormData {
  type: 'website' | 'uninote';
  name: string;
  url?: string;
  description?: string;
}

@Component({
  selector: 'app-main-site',
  standalone: true,
  imports: [
    RouterOutlet,
    SearchBarComponent,
    DatePipe,
    ButtonComponent,
    NgIf,
    FormsModule
  ],
  templateUrl: './main-site.component.html',
  styleUrl: './main-site.component.css',
  providers: [DatePipe]
})
export class MainSiteComponent implements OnInit {
  currentUser: string = "user";
  currentDate: string = '';
  currentDay: string = '';
  currentTime: string = '';

  shortcuts: Shortcut[] = [];
  fadingItems: Set<string> = new Set();

  // Modal properties
  showShortcutModal = false;
  showNoteDetailModal = false;
  selectedNote: UNInoteShortcut | null = null;

  newShortcut: ShortcutFormData = {
    type: 'website',
    name: '',
    url: '',
  };

  recentActivities = [
    { date: new Date(Date.now() - 86400000), description: 'Profile updated' },
    { date: new Date(Date.now() - 172800000), description: 'Card balance checked' },
    { date: new Date(Date.now() - 259200000), description: 'Settings changed' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    if (!this.authService.getLoginStatus()) {
      this.router.navigate(['/UNIcard-login']);
      return;
    }

    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      this.currentUser = storedUsername;
    } else {
      this.authService.logout();
      this.router.navigate(['/UNIcard-login']);
    }

    this.currentDate = this.datePipe.transform(new Date(), 'yyyy. MMMM dd.', 'hu-HU') || '';
    this.currentDay = this.datePipe.transform(new Date(), 'EEEE', 'hu-HU') || '';

    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    this.loadShortcuts();
  }

  updateTime() {
    this.currentTime = this.datePipe.transform(new Date(), 'HH:mm:ss', 'hu-HU') || '';
  }

  isExactMainSitePath = () => this.router.url === '/main-site';

  shouldShowSearchBar(): boolean {
    return !this.isExactMainSitePath() && this.router.url !== '/main-site/you';
  }

  navigateTo(path: string): void {
    this.router.navigate([path]);
  }

  loadShortcuts(): void {
    const savedShortcuts = localStorage.getItem('unicard-shortcuts');
    if (savedShortcuts) {
      try {
        this.shortcuts = JSON.parse(savedShortcuts);
        this.shortcuts = this.shortcuts.map(shortcut => {
          if (shortcut.type === 'uninote') {
            return {
              ...shortcut,
              startTime: new Date(shortcut.startTime)
            };
          }
          return shortcut;
        });

        this.shortcuts = this.shortcuts.filter(shortcut =>
          !(shortcut.type === 'uninote' && (shortcut as UNInoteShortcut).completed)
        );
      } catch (e) {
        console.error('Failed to parse shortcuts:', e);
        this.shortcuts = [];
      }
    }
  }

  saveShortcutsToStorage(): void {
    localStorage.setItem('unicard-shortcuts', JSON.stringify(this.shortcuts));
  }

  openShortcutModal(): void {
    this.newShortcut = {
      type: 'website',
      name: '',
      url: '',
    };
    this.showShortcutModal = true;
  }

  closeShortcutModal(): void {
    this.showShortcutModal = false;
  }

  openNoteDetailModal(note: UNInoteShortcut): void {
    this.selectedNote = note;
    this.showNoteDetailModal = true;
  }

  closeNoteDetailModal(): void {
    this.showNoteDetailModal = false;
    this.selectedNote = null;
  }

  isValidShortcut(): boolean {
    if (!this.newShortcut.name) return false;

    if (this.newShortcut.type === 'website') {
      return !!this.newShortcut.url;
    } else {
      return !!this.newShortcut.description;
    }
  }

  saveShortcut(): void {
    if (!this.isValidShortcut()) return;

    const id = crypto.randomUUID();

    if (this.newShortcut.type === 'website') {
      const websiteShortcut: WebsiteShortcut = {
        id,
        type: 'website',
        name: this.newShortcut.name,
        url: this.newShortcut.url!
      };
      this.shortcuts.push(websiteShortcut);
    } else {
      const uninoteShortcut: UNInoteShortcut = {
        id,
        type: 'uninote',
        name: this.newShortcut.name,
        description: this.newShortcut.description!,
        startTime: new Date(),
        completed: false
      };
      this.shortcuts.push(uninoteShortcut);
    }

    this.saveShortcutsToStorage();
    this.closeShortcutModal();
  }

  openWebsite(url: string): void {
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  }

  toggleNoteComplete(id: string): void {
    const noteIndex = this.shortcuts.findIndex(
      shortcut => shortcut.id === id && shortcut.type === 'uninote'
    );

    if (noteIndex !== -1) {
      const note = this.shortcuts[noteIndex] as UNInoteShortcut;
      note.completed = !note.completed;

      if (note.completed) {
        this.fadingItems.add(id);

        setTimeout(() => {
          this.shortcuts = this.shortcuts.filter(s => s.id !== id);
          this.fadingItems.delete(id);
          this.saveShortcutsToStorage();
        }, 300);
      } else {
        this.saveShortcutsToStorage();
      }
    }
  }

  getWebsiteCount(): number {
    return this.shortcuts.filter(shortcut => shortcut.type === 'website').length;
  }

  getNoteCount(): number {
    return this.shortcuts.filter(shortcut => shortcut.type === 'uninote').length;
  }

  isItemFading(id: string): boolean {
    return this.fadingItems.has(id);
  }

  deleteShortcut(id: string): void {
    this.shortcuts = this.shortcuts.filter(shortcut => shortcut.id !== id);
    this.saveShortcutsToStorage();
  }
}