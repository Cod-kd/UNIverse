import { Component, OnInit, Renderer2, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { DatePipe, registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';
import { ButtonComponent } from "../../general-components/button/button.component";
import { FormsModule } from '@angular/forms';
import { WebsiteShortcut, UNInoteShortcut, Shortcut, ShortcutFormData } from '../../../models/shortcut/shortcut.model';
import { UNIcardComponent } from '../../root-page-components/unicard/unicard.component';
import { LoginService } from '../../../services/login/login.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';

registerLocaleData(localeHu);

@Component({
  selector: 'app-main-site',
  standalone: true,
  imports: [
    RouterOutlet,
    SearchBarComponent,
    DatePipe,
    ButtonComponent,
    FormsModule,
    UNIcardComponent
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

  today: Date = new Date();

  shortcuts: Shortcut[] = [];
  fadingItems: Set<string> = new Set();

  showShortcutModal = false;
  showNoteDetailModal = false;
  selectedNote: UNInoteShortcut | null = null;

  @ViewChild('unicardComponent') unicardComponent!: UNIcardComponent;
  showPasswordPopup = false;
  password = '';
  originalSaveUniCard: Function | null = null;

  newShortcut: ShortcutFormData = {
    type: 'website',
    name: '',
    url: '',
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe,
    private renderer: Renderer2,
    private el: ElementRef,
    private loginService: LoginService,
    private popupService: PopupService
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

    if (!this.authService.getAuthStatus()) {
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

    this.updateTime();
    setInterval(() => this.updateTime(), 1000);

    this.loadShortcuts();
  }

  ngAfterViewInit() {
    if (this.isExactMainSitePath() && this.unicardComponent) {
      this.originalSaveUniCard = this.unicardComponent.saveUniCard;

      this.unicardComponent.saveUniCard = async (): Promise<void> => {
        this.showPasswordPopup = true;
        return Promise.resolve();
      };
    }
  }

  async confirmUniCardDownload(): Promise<void> {
    const username = localStorage.getItem('username');

    if (!username || !this.password) {
      this.popupService.showError('Hiányzó felhasználónév vagy jelszó!');
      return;
    }

    this.loginService.fetchLogin(username, this.password, false).subscribe({
      next: (token) => {
        if (token) {
          if (this.originalSaveUniCard && this.unicardComponent) {
            this.unicardComponent.userData = {
              ...this.unicardComponent.userData,
              username: username,
              password: this.password
            };

            this.originalSaveUniCard.call(this.unicardComponent);
            this.closePasswordPopup();
          }
        }
      },
      error: () => {
        this.popupService.showError('Hibás jelszó!');
      }
    });
  }

  closePasswordPopup(): void {
    this.showPasswordPopup = false;
    this.password = '';
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
    this.router.navigateByUrl(path);
  }

  loadShortcuts(): void {
    const savedShortcuts = localStorage.getItem('shortcuts');
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
        this.shortcuts = [];
      }
    }
  }

  saveShortcutsToStorage(): void {
    localStorage.setItem('shortcuts', JSON.stringify(this.shortcuts));
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