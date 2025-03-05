import { Component } from '@angular/core';
import { ButtonComponent } from "../../general-components/button/button.component";
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
  isLoggedIn: boolean = false; // Initialize with a default value

  constructor(private router: Router, private authService: AuthService) {
    this.checkLoginStatus();
  }

  async checkLoginStatus() {
    this.isLoggedIn = await this.authService.getLoginStatus();

    if (this.isLoggedIn && !this.router.url.includes('/main-site/page-not-found')) {
      this.router.navigate(['/main-site/page-not-found']);
    }
  }

  backToHome() {
    this.isLoggedIn ? this.router.navigate(['/main-site']) : this.router.navigate(['/']);
  }
}

