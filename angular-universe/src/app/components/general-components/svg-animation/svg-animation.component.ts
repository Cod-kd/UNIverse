import { Component, Input, ElementRef, AfterViewInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-svg-animation',
  standalone: true,
  imports: [],
  templateUrl: './svg-animation.component.html',
  styleUrl: './svg-animation.component.css'
})
export class SvgAnimationComponent implements AfterViewInit {
  @Input() svgName = "";
  @ViewChild('svgContainer', { static: true }) svgContainer!: ElementRef;

  ngAfterViewInit() {
    this.showAnimation();
  }

  async showAnimation() {
    const response = await fetch(`svgs/${this.svgName}`);
    const data = await response.text();
    const container = this.svgContainer.nativeElement;
    container.innerHTML = data;

    setTimeout(() => {
      const allPaths = container.querySelectorAll("path");
      allPaths.forEach((path: SVGPathElement) => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
        path.getBoundingClientRect();
        path.style.transition = "stroke-dashoffset 3s ease-in-out";
        path.style.strokeDashoffset = "0";
      });
    }, 0);
  }
}
