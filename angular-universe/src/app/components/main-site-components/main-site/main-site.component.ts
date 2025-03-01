import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBarComponent } from '../../general-components/search-bar/search-bar.component';
import { AuthService } from '../../../services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { ButtonComponent } from "../../general-components/button/button.component";

@Component({
  selector: 'app-main-site',
  standalone: true,
  imports: [RouterOutlet, SearchBarComponent, DatePipe, ButtonComponent],
  templateUrl: './main-site.component.html',
  styleUrl: './main-site.component.css',
  providers: [DatePipe]
})
export class MainSiteComponent implements OnInit {
  currentUser: string = "user";
  currentDate: string = '';
  currentDay: string = '';
  currentTime: string = '';

  recentActivities = [
    { date: new Date(Date.now() - 86400000), description: 'Profile updated' },
    { date: new Date(Date.now() - 172800000), description: 'Card balance checked' },
    { date: new Date(Date.now() - 259200000), description: 'Settings changed' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService,
    private datePipe: DatePipe
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

    // Format the date in Hungarian
    this.currentDate = this.datePipe.transform(new Date(), 'yyyy. MMMM dd.', 'hu-HU') || '';
    this.currentDay = this.datePipe.transform(new Date(), 'EEEE', 'hu-HU') || '';

    // Update time every second
    this.updateTime();
    setInterval(() => this.updateTime(), 1000);
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
}
