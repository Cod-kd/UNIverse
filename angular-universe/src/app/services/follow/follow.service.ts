import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { FetchService } from '../fetch/fetch.service';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  constructor(private fetchService: FetchService) { }

  getUserId(username: string): Observable<number> {
    return this.fetchService.get('/user/id', {
      params: { username }
    });
  }

  checkFollowStatus(followerId: string, followedId: number): Observable<boolean> {
    return this.fetchService.post('/user/isFollowed', {
      followerId,
      followedId
    });
  }

  followUser(targetUserName: string): Observable<any> {
    const followerId = localStorage.getItem('userId');

    if (!followerId) {
      return throwError(() => new Error('No logged in user found'));
    }

    return this.fetchService.post(
      `/user/name/${targetUserName}/follow`,
      { followerId },
      { responseType: 'text' }
    );
  }

  unfollowUser(targetUserName: string): Observable<any> {
    const followerId = localStorage.getItem('userId');

    if (!followerId) {
      return throwError(() => new Error('No logged in user found'));
    }

    return this.fetchService.post(
      `/user/name/${targetUserName}/unfollow`,
      { followerId },
      { responseType: 'text' }
    );
  }
}