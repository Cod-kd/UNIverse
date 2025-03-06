import { Injectable } from '@angular/core';
import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, } from '@angular/core';
import { PopupComponent } from '../../components/general-components/popup/popup.component';

export type PopupMessageType = 'error' | 'success';

@Injectable({ providedIn: 'root' })
export class PopupService {
  private activePopups: ComponentRef<PopupComponent>[] = [];

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) { }

  private show(message: string, type: PopupMessageType = 'success', duration = 3000): void {
    if (this.activePopups.length >= 3) {
      this.destroyOldestPopup();
    }

    const popupComponent = createComponent(PopupComponent, {
      environmentInjector: this.injector,
    });

    popupComponent.instance.popupMessage = message;
    popupComponent.instance.isErrorMessage = type === 'error';

    this.appRef.attachView(popupComponent.hostView);

    const domElem = popupComponent.location.nativeElement;
    this.positionPopup(domElem);

    const modalContent = domElem.querySelector('.modal-content');
    modalContent?.classList.add('active');

    document.body.appendChild(domElem);
    this.activePopups.push(popupComponent);

    setTimeout(() => this.fadeOutAndDestroy(popupComponent), duration);
  }

  showError(message: string, duration = 3000): void {
    this.show(message, 'error', duration);
  }

  showSuccess(message: string, duration = 3000): void {
    this.show(message, 'success', duration);
  }

  private positionPopup(domElem: HTMLElement): void {
    Object.assign(domElem.style, {
      position: 'fixed',
      zIndex: '100',
      right: '20px',
      bottom: '20px',
      transform: 'none'
    });

    const offset = this.activePopups.length * 110;
    if (offset > 0) {
      domElem.style.bottom = `${20 + offset}px`;
    }
  }

  private repositionAllPopups(): void {
    this.activePopups.forEach((popup, index) => {
      const domElem = popup.location.nativeElement;
      const bottom = index === 0 ? 20 : 20 + (index * 110);
      domElem.style.bottom = `${bottom}px`;
    });
  }

  private destroyOldestPopup(): void {
    const oldestPopup = this.activePopups.shift();
    if (oldestPopup) {
      this.destroyPopup(oldestPopup);
      this.repositionAllPopups();
    }
  }

  private fadeOutAndDestroy(popupComponent: ComponentRef<PopupComponent>): void {
    const domElem = popupComponent.location.nativeElement;
    const modalContent = domElem.querySelector('.modal-content');

    modalContent?.classList.remove('active');
    modalContent?.classList.add('inactive');

    setTimeout(() => this.destroyPopup(popupComponent), 500);
  }

  private destroyPopup(popupComponent: ComponentRef<PopupComponent>): void {
    const index = this.activePopups.indexOf(popupComponent);
    if (index !== -1) {
      this.activePopups.splice(index, 1);
      this.appRef.detachView(popupComponent.hostView);
      popupComponent.destroy();

      this.repositionAllPopups();
    }
  }
}