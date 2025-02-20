import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../../../services/validation/validation.service';

@Component({
  selector: 'app-toggle-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './toggle-input.component.html',
  styleUrls: ['./toggle-input.component.css'],
})
export class ToggleInputComponent {
  constructor(private validationService: ValidationService) { }
  showPassword = false;
  passwordControl = new FormControl('');

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onPasswordChange() {
    const password = this.passwordControl.value;
    if (typeof password === 'string') {
      this.validationService.validatePassword(password);
    }
  }
}
