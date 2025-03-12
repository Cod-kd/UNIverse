import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from "../../general-components/button/button.component";
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { WebsiteShortcut, UNInoteShortcut, Shortcut, ShortcutFormData } from '../../../models/shortcut/shortcut.model';

@Component({
  selector: 'app-main-site',
  standalone: true,
  imports: [
    RouterOutlet,
    SearchBarComponent,
    DatePipe,
    ButtonComponent,
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
  followerCount: number = 0;
  postCount: number = 0;

  shortcuts: Shortcut[] = [];
  fadingItems: Set<string> = new Set();

  showShortcutModal = false;
  showNoteDetailModal = false;
  selectedNote: UNInoteShortcut | null = null;

  newShortcut: ShortcutFormData = {
    type: 'website',
    name: '',
    url: '',
  };

  recentActivities = [
    { date: new Date(Date.now() - 86400000), description: 'Profil frissítve' },
    { date: new Date(Date.now() - 259200000), description: 'Beállítások módosítva' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private el: ElementRef
  ) { }

  ngOnInit() {
    registerLocaleData(localeHu);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const searchContainer = this.el.nativeElement.querySelector('#sticky-search-container');
        if (this.router.url !== '/main-site/user-profile') {
          this.renderer.removeClass(searchContainer, 'relative-search');
          this.renderer.addClass(searchContainer, 'sticky-search');
        } else {
          this.renderer.removeClass(searchContainer, 'sticky-search');
          this.renderer.addClass(searchContainer, 'relative-search');
        }
      }
    });

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

    const now = new Date();
    this.currentDate = this.formatDateToHungarian(now);
    this.currentDay = this.getHungarianDayName(now.getDay());

    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    this.loadShortcuts();
  }

  formatDateToHungarian(date: Date): string {
    const months = [
      'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
      'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
    ];

    return `${date.getFullYear()}. ${months[date.getMonth()]} ${date.getDate()}.`;
  }

  getHungarianDayName(dayIndex: number): string {
    const days = [
      'Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat'
    ];
    return days[dayIndex];
  }

  updateTime() {
    this.currentTime = this.datePipe.transform(new Date(), 'HH:mm:ss', 'hu-HU') || '';
  }

  isExactMainSitePath = () => this.router.url === '/main-site';

  shouldShowSearchBar(): boolean {
    return !this.isExactMainSitePath() &&
      !this.router.url.startsWith('/main-site/groups/') &&
      !['/main-site/settings', '/main-site/you', '/main-site/events'].includes(this.router.url);
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
    this.newShortcut.name = this.newShortcut.name.charAt(0).toUpperCase() + this.newShortcut.name.slice(1);

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
        setTimeout(() => {
          this.fadingItems.add(id);
        }, 300);

        setTimeout(() => {
          this.shortcuts = this.shortcuts.filter(s => s.id !== id);
          this.fadingItems.delete(id);
          this.saveShortcutsToStorage();
        }, 600);
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