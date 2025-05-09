import { Component, HostListener, ElementRef, OnInit, DestroyRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, Observable } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { NavItem } from '../../../models/nav/nav.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isMobile = false;
  hasToken$: Observable<boolean>; // Declare without initialization
  private lastScrollPosition = 0;

  // Navigation items for the header menu
  navItems: NavItem[] = [
    { path: '/main-site/user-profile', label: 'Felhasználók' },
    { path: '/main-site/groups', label: 'Csoportok' },
    { path: '/main-site/events', label: 'Események' },
    { path: '/main-site/settings', label: 'Beállítások' }
  ];

  constructor(
    private elementRef: ElementRef,
    private viewportScroller: ViewportScroller,
    private authService: AuthService,
    private router: Router,
    private destroyRef: DestroyRef
  ) {
    // Initialize after authService is available
    this.hasToken$ = this.authService.isAuthenticated$;
  }

  ngOnInit() {
    this.checkScreenSize();

    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.onWindowScroll());
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 468;
    if (!this.isMobile) this.isMenuOpen = false;
  }

  onWindowScroll() {
    const currentScroll = window.scrollY;
    if (Math.abs(currentScroll - this.lastScrollPosition) > 10) {
      this.isMenuOpen = false;
      this.lastScrollPosition = currentScroll;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onNavigate() {
    this.isMenuOpen = false;
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/']);
  }
}