import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SearchBarComponent } from '../../general-components/search-bar/search-bar.component';
import { SvgAnimationComponent } from '../../general-components/svg-animation/svg-animation.component';

@Component({
  selector: 'app-main-site',
  standalone: true,
  imports: [RouterOutlet, SearchBarComponent, SvgAnimationComponent],
  templateUrl: './main-site.component.html',
  styleUrl: './main-site.component.css'
})
export class MainSiteComponent {
  currentUser: string = "user";

  async ngOnInit() {
    const animationDiv = document.querySelector('#animationDiv');
    animationDiv?.classList.add('active-animation');
    await new Promise(resolve => setTimeout(resolve, 5000));
    animationDiv?.classList.remove('active-animation');
  }

  constructor(private router: Router) {
    const storedData = localStorage.getItem("username");
    if (storedData) {
      this.currentUser = storedData;
    }
  }

  isExactMainSitePath = () => this.router.url === '/main-site';
}