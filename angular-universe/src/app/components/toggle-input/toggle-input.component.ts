import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-toggle-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './toggle-input.component.html',
  styleUrl: './toggle-input.component.css'
})
export class ToggleInputComponent {
  showPassword = false;
  passwordControl = new FormControl('');

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
