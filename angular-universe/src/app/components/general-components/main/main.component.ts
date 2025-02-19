import { Component, OnInit } from '@angular/core';
import { InfoCardComponent } from '../../root-page-components/info-card/info-card.component';
import { RouterOutlet, Router } from '@angular/router';
import { SvgAnimationComponent } from "../svg-animation/svg-animation.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [InfoCardComponent, RouterOutlet, SvgAnimationComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent implements OnInit {
  isMainSite = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.subscribe(() => {
      this.isMainSite = this.router.url.includes("/main-site");
    });
  }
}