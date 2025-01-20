import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-home-button',
  standalone: true,
  imports: [],
  templateUrl: './home-button.component.html',
  styleUrl: './home-button.component.scss'
})
export class HomeButtonComponent {
  @Input() btnId: string = "";
  @Input() btnInnerHTML: string = "";
  
  reloadPage(): void{
    window.location.reload();
  }
}
