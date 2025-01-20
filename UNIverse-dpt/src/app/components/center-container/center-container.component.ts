import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-center-container',
  standalone: true,
  imports: [ButtonComponent, RouterModule],
  templateUrl: './center-container.component.html',
  styleUrl: './center-container.component.scss'
})

export class CenterContainerComponent {
  constructor(private router: Router) { }

  onRegisterClick() {
    this.router.navigate(["/registration"]);
  }

  onLoginClick(){
    this.router.navigate(["/login"])
  }
}