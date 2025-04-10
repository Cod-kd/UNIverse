import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { ValidationService } from '../../../services/validation/validation.service';

@Component({
  selector: 'app-toggle-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './toggle-input.component.html',
  styleUrls: ['./toggle-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleInputComponent),
      multi: true
    }
  ]
})
export class ToggleInputComponent implements ControlValueAccessor {
  constructor(private validationService: ValidationService) { }

  showPassword = false;
  passwordControl = new FormControl('');
  fieldTouched = false;

  onChange: (value: string) => void = () => { };
  onTouched: () => void = () => { };

  // Toggle password visibility
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  // Validate password on input (keydown) - silently
  onPasswordChange() {
    const password = this.passwordControl.value;
    if (typeof password === 'string') {
      // Always pass true for silent validation during typing
      if (password.trim()) {
        this.validationService.validatePassword(password, true);
      }
      this.onChange(password);
    }
  }

  // On blur, mark as touched and validate with error messages
  onPasswordBlur() {
    this.fieldTouched = true;
    const password = this.passwordControl.value;
    if (typeof password === 'string' && password.trim()) {
      // Now show validation errors since field has been touched
      this.validationService.validatePassword(password, false);
    }
    this.onTouched();
  }

  // Implement ControlValueAccessor methods
  writeValue(value: string): void {
    if (value !== undefined) {
      this.passwordControl.setValue(value);
    }
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Enable or disable the input field
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.passwordControl.disable();
    } else {
      this.passwordControl.enable();
    }
  }
}