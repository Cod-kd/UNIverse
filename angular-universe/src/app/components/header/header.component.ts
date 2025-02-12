import { Component, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMenuOpen = false;
  isMobile = false;
  private lastScrollPosition = 0;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  checkScreenSize() {
    this.isMobile = window.innerWidth <= 768;
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
    // Close menu if clicking outside
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(event: Event) {
    event.stopPropagation(); // Prevent document click from immediately closing
    this.isMenuOpen = !this.isMenuOpen;
  }
}
