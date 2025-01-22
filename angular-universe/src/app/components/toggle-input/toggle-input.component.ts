import { Component } from '@angular/core';

@Component({
  selector: 'app-toggle-input',
  standalone: true,
  imports: [],
  templateUrl: './toggle-input.component.html',
  styleUrl: './toggle-input.component.css'
})
export class ToggleInputComponent {
  showPassword = false;

  togglePasswordVisibility() {
     this.showPassword = !this.showPassword;
  }
}
