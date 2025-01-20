import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toggle-visibility-button',
  standalone: true,
  imports: [],
  templateUrl: './toggle-visibility-button.component.html',
  styleUrl: './toggle-visibility-button.component.scss'
})
export class ToggleVisibilityButtonComponent {
  @Input() inputId: string = '';
  @Input() btnId: string = 'toggleBtn';
  btnLabel: string = 'Show';

  toggleVisibility(): void {
    const inputElement = document.getElementById(this.inputId) as HTMLInputElement;
    if (inputElement) {
      if (inputElement.type === 'password') {
        inputElement.type = 'text';
        this.btnLabel = 'Hide';
      } else {
        inputElement.type = 'password';
        this.btnLabel = 'Show';
      }
    } else {
      console.error(`Input element with ID "${this.inputId}" not found.`);
    }
  }
}
