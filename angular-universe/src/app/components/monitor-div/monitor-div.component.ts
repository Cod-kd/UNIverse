import { Component } from '@angular/core';
import { BtnComponent } from '../btn/btn.component';

@Component({
  selector: 'app-monitor-div',
  standalone: true,
  imports: [BtnComponent],
  templateUrl: './monitor-div.component.html',
  styleUrl: './monitor-div.component.scss'
})
export class MonitorDivComponent {

}
