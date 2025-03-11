import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() btnLabel: string = "";
  @Input() iconClass: string = "";
  @Input() isDisabled: boolean = false;
  @Input() size: 'small' | 'normal' | 'big' = 'normal';
  @Input() shape: 'circle' | 'rounded' | 'rectangle' = 'rounded';

  // Function that returns the class based on size value
  get sizeClass() {
    switch (this.size) {
      case 'small': return 'button-small';
      case 'normal': return 'button-normal';
      case 'big': return 'button-big';
      default: return 'button-normal';
    }
  }

  // Function that returns the class based on shape value
  get shapeClass() {
    switch (this.shape) {
      case 'circle': return 'button-circle';
      case 'rectangle': return 'button-rectangle';
      default: return 'button-rounded';
    }
  }
}