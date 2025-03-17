import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "../../general-components/button/button.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleInputComponent } from '../toggle-input/toggle-input.component';
import { LoginService } from '../../../services/login/login.service';
import { ValidationService } from '../../../services/validation/validation.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { AuthService } from '../../../services/auth/auth.service';

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
  loginForm;

  constructor(
    private router: Router,
    private popupService: PopupService,
    private validationService: ValidationService,
    private loginService: LoginService,
    private authService: AuthService,
    private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.loginForm.valueChanges.subscribe(() => {
      this.updateLoginButtonState();
    });
  }

  ngOnInit(): void {
    // Check for stored token on component initialization
    this.checkStoredAuth();
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
      this.popupService.showError("Hiányzó adatok");
      return;
    }

    // Validate username and password before making login request
    const isUsernameValid = this.validationService.validateUsername(username);
    const isPasswordValid = this.validationService.validatePassword(password);

    if (isUsernameValid && isPasswordValid) {
      this.loginService.fetchLogin(username, password).subscribe({
        next: (token: string) => {
          if (token) {
            // Pass credentials and token to handle login
            this.loginService.handleLoginResponse({ username }, token);
          } else {
            this.popupService.showError("Érvénytelen token!");
          }
        }
      });
    }
  }

  // Check for stored token on component initialization
  private checkStoredAuth(): void {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    if (token && username && userId) {
      // Auto-validate existing token
      this.router.navigate(['/main-site']);
    }
  }

  // Navigate to UNIcard login page
  onUNIcardLoginClick = () => this.router.navigate(["/UNIcard-login"]);

  // Navigate back to registration page
  backToRegistration = () => this.router.navigate(["/registration"]);
}