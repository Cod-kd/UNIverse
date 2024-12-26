import { Component } from '@angular/core';
import { RegisterLoginBtnComponent } from '../register-login-btn/register-login-btn.component';

@Component({
  selector: 'app-monitor-div',
  standalone: true,
  imports: [RegisterLoginBtnComponent],
  templateUrl: './monitor-div.component.html',
  styleUrl: './monitor-div.component.scss'
})
export class MonitorDivComponent {

}
