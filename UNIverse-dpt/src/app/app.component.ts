import { Component } from '@angular/core';
import { InfoCardComponent } from "./components/info-card/info-card.component";
import { FooterComponent } from "./components/footer/footer.component";
import { MonitorDivComponent } from './components/monitor-div/monitor-div.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MonitorDivComponent, InfoCardComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'UNIverse-dpt';
}
