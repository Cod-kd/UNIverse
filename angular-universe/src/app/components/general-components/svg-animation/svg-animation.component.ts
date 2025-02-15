import { Component, Input, ElementRef, AfterViewInit } from '@angular/core';
import { PopupService } from '../../../services/popup-message/popup-message.service';

@Component({
  selector: 'app-svg-animation',
  standalone: true,
  imports: [],
  templateUrl: './svg-animation.component.html',
  styleUrl: './svg-animation.component.css'
})
export class SvgAnimationComponent implements AfterViewInit {
  @Input() svgPath: string = "";

  constructor(private el: ElementRef, private popupService: PopupService) { }

  async ngAfterViewInit() {
    if (this.svgPath) {
      await this.loadAndAnimateSvg();
    }
  }

  private async loadAndAnimateSvg() {
    try {
      const response = await fetch(this.svgPath);
      const data = await response.text();
      const container = this.el.nativeElement.querySelector("div");
      container.innerHTML = data;

      const allPaths = container.querySelectorAll("path");
      allPaths.forEach((path: SVGPathElement) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.getBoundingClientRect();
        path.style.transition = "stroke-dashoffset 3s ease-in-out";
        path.style.strokeDashoffset = "0";
      });
    } catch (error) {
      this.popupService.show("Error loading SVG: " + error);
    }
  }
}
