import { Component, AfterViewInit, inject } from '@angular/core';
import { FooterComponent } from './components/general-components/footer/footer.component';
import { MainComponent } from "./components/general-components/main/main.component";
import { HeaderComponent } from './components/general-components/header/header.component';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, MainComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  isLoading = true;
  private titleService = inject(Title);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let route = this.activatedRoute.firstChild;
      while (route?.firstChild) {
        route = route.firstChild;
      }
      let title = route?.snapshot.data['title'] || route?.snapshot.routeConfig?.path || 'Home';
      title = this.capitalizeTitle(title);
      this.titleService.setTitle(`UNIverse - ${title}`);
    });
  }

  ngAfterViewInit() {
    document.addEventListener('DOMContentLoaded', () => {
      this.isLoading = false;
    });
  }

  private capitalizeTitle(title: string): string {
    return title
      .replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }
}
