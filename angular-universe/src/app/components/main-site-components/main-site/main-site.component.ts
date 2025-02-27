import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBarComponent } from '../../general-components/search-bar/search-bar.component';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-main-site',
  standalone: true,
  imports: [RouterOutlet, SearchBarComponent],
  templateUrl: './main-site.component.html',
  styleUrl: './main-site.component.css'
})
export class MainSiteComponent implements OnInit {
  currentUser: string = "user";

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
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
  }

  isExactMainSitePath = () => this.router.url === '/main-site';
  
  shouldShowSearchBar(): boolean {
    return !this.isExactMainSitePath() && this.router.url !== '/main-site/you';
  }
}