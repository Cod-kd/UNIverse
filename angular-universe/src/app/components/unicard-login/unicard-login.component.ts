import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";
import { Router } from '@angular/router';
@Component({
  selector: 'app-unicard-login',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './unicard-login.component.html',
  styleUrl: './unicard-login.component.css'
})
export class UNIcardLoginComponent {
  constructor(private router: Router) { }

  loginWithCard() {
    alert("Successful login");
  }

  backToCredentialLogin() {
    this.router.navigate(["/login"]);
  }

  backToRegistration() {
    this.router.navigate(["/registration"])
  }
}
