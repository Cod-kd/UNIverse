import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { AuthType, FetchService } from '../fetch/fetch.service';
import { catchError, timeout, retry, finalize } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  constructor(
    private fetchService: FetchService,
    private loadingService: LoadingService,
  ) { }

  getUserId(username: string): Observable<number> {
    return this.fetchService.get<number>('/user/id', {
      params: { username },
      authType: AuthType.NONE
    }).pipe(
      timeout(8000),
      retry(1),
      catchError(error => {
        return throwError(() => error);
      })
    );
  }

  checkFollowStatus(followedId: number): Observable<boolean> {
    return this.fetchService.post<boolean>('/user/isFollowed', {
      followedId,
    }, {
      authType: AuthType.JWT
    }).pipe(
      catchError(() => {
        return of(false);
      })
    );
  }

  followUser(targetUserName: string): Observable<any> {
    this.loadingService.show();
    return this.fetchService.post(
      `/user/name/${targetUserName}/follow`, {},
      { responseType: 'text', authType: AuthType.JWT }
    ).pipe(
      timeout(10000),
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  unfollowUser(targetUserName: string): Observable<any> {
    this.loadingService.show();
    return this.fetchService.post(
      `/user/name/${targetUserName}/unfollow`, {},
      { responseType: 'text', authType: AuthType.JWT }
    ).pipe(
      timeout(10000),
      catchError(error => {
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}