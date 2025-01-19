import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(private router: Router) { }

  onUNIcardLoginClick() {
    this.router.navigate(["/UNIcard-login"]);
  }

  loginWithCredentials() {
    alert("Successful login!");
  }

  backToRegistration(){
    this.router.navigate(["/registration"])
  }
}