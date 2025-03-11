import { Component, HostListener, ElementRef, OnInit, DestroyRef, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
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
  isLoggedIn$;
  private lastScrollPosition = 0;
  private destroyRef = inject(DestroyRef);

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
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  ngOnInit() {
    this.checkScreenSize(); // Determine if the screen is mobile on load

    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(100),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.onWindowScroll());
  }

  @HostListener('window:resize')
  checkScreenSize() {
    // Check if the screen width is small enough to be considered mobile
    this.isMobile = window.innerWidth <= 468;
    if (!this.isMobile) this.isMenuOpen = false; // Close the menu on larger screens
  }

  onWindowScroll() {
    const currentScroll = window.scrollY;
    // Close the menu if the scroll distance is significant
    if (Math.abs(currentScroll - this.lastScrollPosition) > 10) {
      this.isMenuOpen = false;
      this.lastScrollPosition = currentScroll;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Close the menu if the user clicks outside of it
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  // Toggle the menu open/close state
  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onNavigate() {
    this.isMenuOpen = false;
    this.viewportScroller.scrollToPosition([0, 0]); // Scroll to the top of the page
  }

  logout() {
    this.authService.logout();
    this.isMenuOpen = false;
    this.router.navigate(['/']);
  }
}
