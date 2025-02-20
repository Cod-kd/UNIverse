import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';

@Component({
  selector: 'app-lottie',
  standalone: true,
  imports: [],
  templateUrl: './lottie.component.html',
  styleUrl: './lottie.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LottieComponent {
  @Input() animationUrl: string = '';
  @Input() animWidth: string = '500px';
  @Input() animHeight: string = '500px';
}
