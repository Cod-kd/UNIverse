import { Injectable } from '@angular/core';
import { FetchService, AuthType } from '../fetch/fetch.service';
import { Observable, map, catchError, of } from 'rxjs';

interface UsernameResponse {
  username: string;
}

interface IdResponse {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserBasicService {
  constructor(private fetchService: FetchService) { }

  idByUsername(username: string): Observable<IdResponse> {
    return this.fetchService.get<IdResponse>('/user/id', {
      params: { username },
      authType: AuthType.NONE
    });
  }

  usernameById(id: number | string): Observable<UsernameResponse> {
    return this.fetchService.get<string>('/user/username', {
      params: { id: id.toString() },
      authType: AuthType.NONE,
      responseType: 'text'
    }).pipe(
      map(username => ({ username })),
      catchError(error => {
        if (error?.error?.text) {
          return of({ username: error.error.text });
        }
        return of({ username: `User #${id}` });
      })
    );
  }
}