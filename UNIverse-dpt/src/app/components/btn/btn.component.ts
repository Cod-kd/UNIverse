import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-btn',
  standalone: true,
  imports: [],
  templateUrl: 'btn.component.html',
  styleUrl: 'btn.component.scss'
})
export class BtnComponent {
  @Input() btnId: string = '';
  @Input() btnTitle: string = '';
}
