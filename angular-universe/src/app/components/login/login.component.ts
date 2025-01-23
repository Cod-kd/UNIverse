import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "../button/button.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleInputComponent } from '../toggle-input/toggle-input.component';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, ToggleInputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @ViewChild(ToggleInputComponent) passwordInput!: ToggleInputComponent;
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.checkStoredCredentials();
  }

  loginWithCredentials() {
    this.loginForm.patchValue({
      password: this.passwordInput.passwordControl.value
    });

    const { username, password } = this.loginForm.value;

    if (username && password) {
      this.loginService.fetchLogin(username, password).subscribe({
        next: (response) => {
          this.loginService.handleLoginResponse(response, this.loginForm.value);
        },
        error: (err) => {
          this.loginService.handleError(err);
        }
      });
    }
  }

  private checkStoredCredentials(): void {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword) {
      this.loginService.fetchLogin(storedUsername, storedPassword).subscribe({
        next: (response) => {
          this.loginService.handleLoginResponse(response, { 
            username: storedUsername, 
            password: storedPassword 
          });
        },
        error: () => {
          localStorage.removeItem('username');
          localStorage.removeItem('password');
        }
      });
    }
  }

  onUNIcardLoginClick = () => this.router.navigate(["/UNIcard-login"]);
  backToRegistration = () => this.router.navigate(["/registration"]);
}
