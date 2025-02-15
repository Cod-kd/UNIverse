import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBarComponent } from '../../general-components/search-bar/search-bar.component';
import { AnimationService } from '../../../services/animation/animation.service';

@Component({
  selector: 'app-main-site',
  standalone: true,
  imports: [RouterOutlet, SearchBarComponent],
  templateUrl: './main-site.component.html',
  styleUrl: './main-site.component.css'
})
export class MainSiteComponent {
  currentUser: string = "user";

  constructor(
    private router: Router,
    private animationService: AnimationService
  ) {
    const storedData = localStorage.getItem("username");
    if (storedData) {
      this.currentUser = storedData;
    }
  }

  ngOnInit() {
    if (this.router.url === '/main-site') {
      this.animationService.playAnimation('svgs/welcome.svg');
    }
  }

  isExactMainSitePath = () => this.router.url === '/main-site';
}