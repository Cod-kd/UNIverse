import { Injectable } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthType, FetchService } from '../fetch/fetch.service';
import { Comment } from '../../models/comment/comment.model';
import { PopupService } from '../popup-message/popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  constructor(
    private fetchService: FetchService,
    private popupService: PopupService
  ) { }

  getCommentsByPostId(postId: number): Observable<Comment[]> {
    return this.fetchService.get<Comment[]>(`/groups/post/get/comment`, {
      params: { postId: postId.toString() },
      authType: AuthType.NONE,
      responseType: 'json',
      showError: true
    }).pipe(
      catchError(() => {
        return of([]);
      })
    );
  }

  addComment(postId: number, comment: string): Observable<string> {
    return this.fetchService.post<string>(
      `/groups/post/add/comment`,
      { postId, comment },
      { responseType: 'text', authType: AuthType.JWT }
    ).pipe(
      catchError(error => {
        this.popupService.showError('Sikertelen kommentelés');
        return throwError(() => error);
      })
    );
  }
}