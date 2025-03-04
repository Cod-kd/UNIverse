import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingBS = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingBS.asObservable();

  show(): void {
    this.loadingBS.next(true);
  }

  hide(): void {
    this.loadingBS.next(false);
  }
}