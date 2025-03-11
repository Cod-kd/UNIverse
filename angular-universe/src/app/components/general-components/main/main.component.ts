import { Component, OnInit } from '@angular/core';
import { InfoCardComponent } from '../../root-page-components/info-card/info-card.component';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [InfoCardComponent, RouterOutlet],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  isMainSite = false;

  constructor(private router: Router) {
    this.isMainSite = this.router.url.includes("/main-site");
  }

  // Determines if the url is /main-site or not at initialization
  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isMainSite = this.router.url.includes("/main-site");
    });
  }
}