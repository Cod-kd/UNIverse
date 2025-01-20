import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-response-window',
  standalone: true,
  imports: [],
  templateUrl: './response-window.component.html',
  styleUrls: ['./response-window.component.scss']
})
export class ResponseWindowComponent implements OnInit {
  @Input() text: string = '';  // The text to be displayed in the response window
  isVisible: boolean = false;  // Control the visibility of the window

  async ngOnInit(): Promise<void> {
    await this.showWindow();
  }

  // Show the error window with animation
  async showWindow(): Promise<void> {
    this.isVisible = true;
    const errorWindow = document.getElementById("errorWindow") as HTMLElement;
    
    if (errorWindow) {
      errorWindow.style.animation = "showWindow 0.5s 1 forwards ease";
      await this.delay(3000);
      this.hideWindow();
    }
  }

  // Hide the error window with animation
  async hideWindow(): Promise<void> {
    const errorWindow = document.getElementById("errorWindow") as HTMLElement;
    if (errorWindow) {
      errorWindow.style.animation = "hideWindow 0.5s 1 forwards ease";
      await this.delay(600);
      this.isVisible = false;
    }
  }

  // Utility function to introduce delays
  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
