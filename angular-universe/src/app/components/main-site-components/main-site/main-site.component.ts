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
  constructor(private router: Router) { }

  isExactMainSitePath = () => this.router.url === '/main-site';
}