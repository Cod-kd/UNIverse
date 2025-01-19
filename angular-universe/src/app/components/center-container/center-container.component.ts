import { Component } from '@angular/core';
import { ButtonComponent } from "../button/button.component";

@Component({
  selector: 'app-center-container',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './center-container.component.html',
  styleUrl: './center-container.component.scss'
})
export class CenterContainerComponent {

}