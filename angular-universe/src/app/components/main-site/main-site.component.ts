import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-main-site',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './main-site.component.html',
  styleUrl: './main-site.component.css'
})
export class MainSiteComponent {
  constructor(private router: Router) { }

  // Check if URL is exactly /main-site with no child routes
  isExactMainSitePath = () => this.router.url === '/main-site';
}