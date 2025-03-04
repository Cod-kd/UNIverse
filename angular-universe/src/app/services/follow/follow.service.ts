import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  followUser(targetUserName: string): Observable<any> {
    const followerId = localStorage.getItem('userId');

    if (!followerId) {
      return throwError(() => new Error('No logged in user found'));
    }

    return this.http.post(
      `${this.baseUrl}/user/name/${targetUserName}/follow`,
      { followerId },
      { responseType: 'text' }
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }

  /* Future implementation awaits
  checkFollowStatus(targetUserName: string): Observable<boolean> {
    const followerId = localStorage.getItem('userId');

    if (!followerId) {
      return throwError(() => new Error('No logged in user found'));
    }

    return this.http.get<boolean>(
      `${this.baseUrl}/user/name/${targetUserName}/follow/status?followerId=${followerId}`
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }
  */
}