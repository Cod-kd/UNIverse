import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../general-components/button/button.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleInputComponent } from '../toggle-input/toggle-input.component';
import { LoginService } from '../../../services/login/login.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';

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
  private validationService = inject(ValidationService);

  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private router: Router, private popupService: PopupService) { }

  ngOnInit(): void {
    this.checkStoredCredentials();
  }

  onUsernameChange() {
    const username = this.loginForm.get('username')?.value;
    if (typeof username === 'string') {
      this.validationService.validateUsername(username);
    }
  }

  loginWithCredentials() {
    const username = this.loginForm.get('username')?.value ?? '';
    const password = this.passwordInput.passwordControl.value ?? '';

    if (!username.trim() && !password.trim()) {
      this.popupService.show("Hiányzó adatok");
      return;
    }

    const isUsernameValid = this.validationService.validateUsername(username);
    const isPasswordValid = this.validationService.validatePassword(password);

    if (isUsernameValid && isPasswordValid) {
      this.loginForm.patchValue({ password });
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