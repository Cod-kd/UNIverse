import { Component, HostListener, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule, ViewportScroller } from '@angular/common';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
  isMobile = false;
  private lastScrollPosition = 0;
  isLoggedIn$;

  constructor(
    private elementRef: ElementRef,
    private viewportScroller: ViewportScroller,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  shouldShowSearchBar(): boolean {
    return this.router.url !== '/main-site/profiles';
  }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 468;
    if (!this.isMobile) this.isMenuOpen = false;
  }

  @HostListener('window:scroll')
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
    localStorage.removeItem("username");
    localStorage.removeItem("password");
  }
}
