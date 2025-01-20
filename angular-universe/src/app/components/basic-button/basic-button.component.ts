import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-basic-button',
  standalone: true,
  imports: [],
  templateUrl: './basic-button.component.html',
  styleUrl: './basic-button.component.scss'
})
export class BasicButtonComponent {
  @Input() btnId: string = "";
  @Input() btnLabel: string = "";
  @Input() initialTransform: string = "";
}
