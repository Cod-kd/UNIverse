import { Component } from '@angular/core';
import { InfoCardComponent } from './components/info-card/info-card.component';
import { FooterComponent } from './components/footer/footer.component';
import { CenterContainerComponent } from "./components/center-container/center-container.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InfoCardComponent, FooterComponent, CenterContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'angular-universe';
}
