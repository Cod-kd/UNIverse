import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserId(username: string): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/user/id`, { 
      params: { username } 
    });
  }

  checkFollowStatus(followerId: string, followedId: number): Observable<boolean> {
    return this.http.post<boolean>(`${this.baseUrl}/user/isFollowed`, { 
      followerId, 
      followedId 
    });
  }

  followUser(targetUserName: string): Observable<any> {
    const followerId = localStorage.getItem('userId');

    if (!followerId) {
      return throwError(() => new Error('No logged in user found'));
    }

    return this.http.post(
      `${this.baseUrl}/user/name/${targetUserName}/follow`,
      { followerId },
      { responseType: 'text' }
    );
  }

  unfollowUser(targetUserName: string): Observable<any> {
    const followerId = localStorage.getItem('userId');

    if (!followerId) {
      return throwError(() => new Error('No logged in user found'));
    }

    return this.http.post(
      `${this.baseUrl}/user/name/${targetUserName}/unfollow`,
      { followerId },
      { responseType: 'text' }
    );
  }
}