import { Injectable } from '@angular/core';
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector } from '@angular/core';
import { PopupComponent } from '../components/popup/popup.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  private popupRef: ComponentRef<PopupComponent> | null = null;

  constructor(
    private appRef: ApplicationRef, 
    private injector: EnvironmentInjector
  ) {}

  show(message: string): void {
    // Cleanup existing popup
    this.destroy();

    // Create and configure popup
    const popupComponent = createComponent(PopupComponent, {
      environmentInjector: this.injector,
    });

    popupComponent.instance.popupMessage = message;

    // Attach and render
    this.appRef.attachView(popupComponent.hostView);
    const domElem = (popupComponent.hostView as any).rootNodes[0] as HTMLElement;
    
    // Style for absolute positioning
    Object.assign(domElem.style, {
      position: 'fixed',
      top: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '9999'
    });
    
    // Target modal-content for animations
    const modalContent = domElem.querySelector('.modal-content');
    modalContent?.classList.add('active');

    document.body.appendChild(domElem);
    this.popupRef = popupComponent;

    // Auto-dismiss with animation
    setTimeout(() => this.fadeOutAndDestroy(), 3000);
  }

  private fadeOutAndDestroy(): void {
    if (this.popupRef) {
      const domElem = (this.popupRef.hostView as any).rootNodes[0] as HTMLElement;
      const modalContent = domElem.querySelector('.modal-content');
      
      // Toggle animation classes
      modalContent?.classList.remove('active');
      modalContent?.classList.add('inactive');

      // Remove after animation
      setTimeout(() => this.destroy(), 500);
    }
  }

  destroy(): void {
    if (this.popupRef) {
      this.appRef.detachView(this.popupRef.hostView);
      this.popupRef.destroy();
      this.popupRef = null;
    }
  }
}