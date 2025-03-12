import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { FetchService } from '../fetch/fetch.service';
import { catchError, timeout, retry, finalize } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';
import { PopupService } from '../popup-message/popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  constructor(
    private fetchService: FetchService,
    private loadingService: LoadingService,
    private popupService: PopupService
  ) { }

  getUserId(username: string): Observable<number> {
    return this.fetchService.get<number>('/user/id', {
      params: { username }
    }).pipe(
      timeout(8000),
      retry(1),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  checkFollowStatus(followerId: string, followedId: number): Observable<boolean> {
    if (!followerId) {
      return of(false);
    }

    return this.fetchService.post<boolean>('/user/isFollowed', {
      followerId,
      followedId
    }).pipe(
      catchError(() => {
        return of(false);
      })
    );
  }

  followUser(targetUserName: string): Observable<any> {
    const followerId = localStorage.getItem('userId');

    if (!followerId) {
      this.popupService.showError('A követéshez jelentkezz be!');
      return throwError(() => new Error('Nem vagy bejelentkezve!'));
    }

    this.loadingService.show();
    return this.fetchService.post(
      `/user/name/${targetUserName}/follow`,
      { followerId },
      { responseType: 'text' }
    ).pipe(
      timeout(10000),
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  unfollowUser(targetUserName: string): Observable<any> {
    const followerId = localStorage.getItem('userId');

    if (!followerId) {
      this.popupService.showError('A kikövetéshez jelentkezz be!');
      return throwError(() => new Error('Nem vagy bejelentkezve!'));
    }

    this.loadingService.show();
    return this.fetchService.post(
      `/user/name/${targetUserName}/unfollow`,
      { followerId },
      { responseType: 'text' }
    ).pipe(
      timeout(10000),
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}