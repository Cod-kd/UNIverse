import { Component } from '@angular/core';
import { FooterComponent } from './components/footer/footer.component';
import { MainComponent } from "./components/main/main.component";
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, MainComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  
}
