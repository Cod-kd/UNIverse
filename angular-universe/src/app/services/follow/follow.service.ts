import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FollowService {
  private baseUrl = 'http://localhost:8080';
  private readonly adminUsername = "admin";
  private readonly adminPassword = "oneOfMyBestPasswords";
  
  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': 'Basic ' + btoa(this.adminUsername + ':' + this.adminPassword),
      'Content-Type': 'application/json'
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
      { headers: this.getAuthHeaders(), responseType: 'text' }
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
      `${this.baseUrl}/user/name/${targetUserName}/follow/status?followerId=${followerId}`,
      { headers: this.getAuthHeaders() }
    ).pipe(
      catchError(err => throwError(() => err))
    );
  }
    */
}