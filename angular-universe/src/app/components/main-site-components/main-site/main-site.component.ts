import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBarComponent } from '../../general-components/search-bar/search-bar.component';

@Component({
  selector: 'app-main-site',
  standalone: true,
  imports: [RouterOutlet, SearchBarComponent],
  templateUrl: './main-site.component.html',
  styleUrl: './main-site.component.css'
})
export class MainSiteComponent {
  currentUser: string = "user";

  constructor(private router: Router) {
    const storedData = localStorage.getItem("username");
    if (storedData) {
      this.currentUser = storedData;
    }
  }

  isExactMainSitePath = () => this.router.url === '/main-site';
}