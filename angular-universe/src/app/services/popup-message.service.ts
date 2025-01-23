import { Injectable } from '@angular/core';
import {
  ApplicationRef,
  ComponentRef,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
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
    this.destroy();

    const popupComponent = createComponent(PopupComponent, {
      environmentInjector: this.injector,
    });

    popupComponent.instance.popupMessage = message;

    this.appRef.attachView(popupComponent.hostView);
    const domElem = (popupComponent.hostView as any).rootNodes[0] as HTMLElement;

    Object.assign(domElem.style, {
      position: 'fixed',
      ...(window.innerWidth <= 480 ? {bottom: "20px"} : {top: "20px"}),
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '1',
    });

    const modalContent = domElem.querySelector('.modal-content');
    modalContent?.classList.add('active');

    document.body.appendChild(domElem);
    this.popupRef = popupComponent;

    setTimeout(() => this.fadeOutAndDestroy(), 3000);
  }

  private fadeOutAndDestroy(): void {
    if (this.popupRef) {
      const domElem = (this.popupRef.hostView as any)
        .rootNodes[0] as HTMLElement;
      const modalContent = domElem.querySelector('.modal-content');

      modalContent?.classList.remove('active');
      modalContent?.classList.add('inactive');

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
