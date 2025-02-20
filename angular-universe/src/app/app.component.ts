import { Component, AfterViewInit } from '@angular/core';
import { FooterComponent } from './components/general-components/footer/footer.component';
import { MainComponent } from "./components/general-components/main/main.component";
import { HeaderComponent } from './components/general-components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FooterComponent, MainComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  isLoading = true;

  ngAfterViewInit() {
    document.addEventListener('DOMContentLoaded', () => {
      this.isLoading = false;
    });
  }
}
