import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { timer } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private readonly ANIMATION_DURATION = 3000;
  private isAnimating = false;

  constructor(private router: Router) { }

  async playAnimation(svgPath: string, nextRoute?: string, callback?: () => void) {
    if (this.isAnimating) return;

    this.isAnimating = true;
    const container = document.createElement('div');
    container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: 1000; background: var(--dark1); display: flex; justify-content: center; align-items: center;';

    const svgComponent = document.createElement('app-svg-animation');
    svgComponent.setAttribute('svgPath', svgPath);
    container.appendChild(svgComponent);
    document.body.appendChild(container);

    await firstValueFrom(timer(this.ANIMATION_DURATION));

    document.body.removeChild(container);
    this.isAnimating = false;

    callback?.();
    if (nextRoute) {
      this.router.navigate([nextRoute]);
    }
  }
}