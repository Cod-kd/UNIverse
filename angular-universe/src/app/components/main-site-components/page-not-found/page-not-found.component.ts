import { Component } from '@angular/core';
import { ButtonComponent } from "../../general-components/button/button.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './page-not-found.component.html',
  styleUrl: './page-not-found.component.css'
})
export class PageNotFoundComponent {
  constructor(private router: Router) { }
  backToHome() {
    this.router.navigate(["/main-site"]);
  }
}
