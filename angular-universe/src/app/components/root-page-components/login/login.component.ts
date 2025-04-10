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

  // Add flags to track if fields have been touched
  usernameFieldTouched = false;

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

    // Listen to form value changes to update login button state in real-time
    this.loginForm.valueChanges.subscribe(() => {
      this.updateLoginButtonState();
    });
  }

  ngOnInit(): void {
    // Check for stored token on component initialization
    this.checkStoredAuth();
  }

  // Handle username input changes - silently validate for button state
  onUsernameChange() {
    const username = this.loginForm.get('username')?.value;

    // Only validate without showing errors while typing
    if (typeof username === 'string') {
      // Pass true to silence error messages while typing
      this.validationService.validateUsername(username, true);
      this.updateLoginButtonState();
    }
  }

  // Mark username as touched when user leaves the field
  onUsernameBlur() {
    this.usernameFieldTouched = true;
    const username = this.loginForm.get('username')?.value;
    if (typeof username === 'string' && username.trim()) {
      // Show validation errors now that field has been touched
      this.validationService.validateUsername(username, false);
    }
  }

  // Enable or disable login button based on form validity
  updateLoginButtonState() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    // Check if both fields have values
    const hasUsername = username && username.trim().length > 0;
    const hasPassword = password && password.trim().length > 0;

    if (hasUsername && hasPassword) {
      // Silently validate for button state only
      const isUsernameValid = this.validationService.validateUsername(username, true);
      const isPasswordValid = this.validationService.validatePassword(password, true);
      this.isLoginDisabled = !(isUsernameValid && isPasswordValid);
    } else {
      this.isLoginDisabled = true;
    }
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

    // Mark fields as touched
    this.usernameFieldTouched = true;
    if (this.passwordInput) {
      this.passwordInput.fieldTouched = true;
    }

    // Validate with visible errors for submission
    const isUsernameValid = this.validationService.validateUsername(username, false);
    const isPasswordValid = this.validationService.validatePassword(password, false);

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