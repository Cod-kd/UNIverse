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
  isLoginDisabled = true;
  private fb = inject(FormBuilder);
  private loginService = inject(LoginService);
  private validationService = inject(ValidationService);

  // Reactive form setup with username and password fields
  loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private router: Router, private popupService: PopupService) {
    // Monitor form changes to enable or disable the login button dynamically
    this.loginForm.valueChanges.subscribe(() => {
      this.updateLoginButtonState();
    });
  }

  ngOnInit(): void {
    // Check for stored credentials on component initialization
    this.checkStoredCredentials();
  }

  // Handle username input changes and validate the username
  onUsernameChange() {
    const username = this.loginForm.get('username')?.value;
    if (typeof username === 'string') {
      this.validationService.validateUsername(username);
      this.updateLoginButtonState();
    }
  }

  // Enable or disable login button based on validation results
  updateLoginButtonState() {
    this.isLoginDisabled = !(this.validationService.usernameValid &&
      this.validationService.passwordValid);
  }

  // Attempt to log in with provided credentials
  loginWithCredentials() {
    const username = this.loginForm.get('username')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    // Show error if both fields are empty
    if (!username.trim() && !password.trim()) {
      this.popupService.show("Hiányzó adatok");
      return;
    }

    // Validate username and password before making login request
    const isUsernameValid = this.validationService.validateUsername(username);
    const isPasswordValid = this.validationService.validatePassword(password);

    if (isUsernameValid && isPasswordValid) {
      this.loginService.fetchLogin(username, password).subscribe({
        next: () => {
          this.loginService.handleLoginResponse(this.loginForm.value);
        }
      });
    }
  }

  // Automatically attempt login if credentials are stored in local storage
  private checkStoredCredentials(): void {
    const storedUsername = localStorage.getItem('username');
    const storedPassword = localStorage.getItem('password');

    if (storedUsername && storedPassword) {
      this.loginService.fetchLogin(storedUsername, storedPassword).subscribe({
        next: () => {
          this.loginService.handleLoginResponse({
            username: storedUsername,
            password: storedPassword
          });
        }
      });
    }
  }

  // Navigate to UNIcard login page
  onUNIcardLoginClick = () => this.router.navigate(["/UNIcard-login"]);

  // Navigate back to registration page
  backToRegistration = () => this.router.navigate(["/registration"]);
}