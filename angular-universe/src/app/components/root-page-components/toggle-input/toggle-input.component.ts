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
  
  onChange: any = () => {};
  onTouched: any = () => {};

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onPasswordChange() {
    const password = this.passwordControl.value;
    if (typeof password === 'string') {
      this.validationService.validatePassword(password);
      this.onChange(password);
    }
  }

  writeValue(value: string): void {
    if (value !== undefined) {
      this.passwordControl.setValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.passwordControl.disable() : this.passwordControl.enable();
  }
}