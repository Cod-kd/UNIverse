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
    // Check if user is already logged in with JWT
    if (this.authService.getLoginStatus()) {
      this.router.navigate(['/main-site']);
    }
  }

  onUsernameChange() {
    const username = this.loginForm.get('username')?.value;
    if (typeof username === 'string') {
      this.validationService.validateUsername(username);
      this.updateLoginButtonState();
    }
  }

  updateLoginButtonState() {
    this.isLoginDisabled = !(this.validationService.usernameValid &&
      this.validationService.passwordValid);
  }

  loginWithCredentials() {
    const username = this.loginForm.get('username')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    if (!username.trim() && !password.trim()) {
      this.popupService.showError("Hiányzó adatok");
      return;
    }

    const isUsernameValid = this.validationService.validateUsername(username);
    const isPasswordValid = this.validationService.validatePassword(password);

    if (isUsernameValid && isPasswordValid) {
      this.loginService.handleLoginResponse({ username, password });
    }
  }

  onUNIcardLoginClick = () => this.router.navigate(["/UNIcard-login"]);
  backToRegistration = () => this.router.navigate(["/registration"]);
}