import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { AuthType, FetchService } from '../fetch/fetch.service';
import { Post } from '../../models/post/post.model';
import { LoadingService } from '../loading/loading.service';
import { PopupService } from '../popup-message/popup-message.service';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private postsSubject = new BehaviorSubject<Post[]>([]);
  posts$ = this.postsSubject.asObservable();

  constructor(
    private fetchService: FetchService,
    private loadingService: LoadingService,
    private popupService: PopupService
  ) { }

  getGroupPosts(groupName: string): Observable<Post[]> {
    this.loadingService.show();

    return this.fetchService.get<Post[]>(`/groups/name/${encodeURIComponent(groupName)}/posts`, {
      authType: AuthType.NONE
    }).pipe(
      tap(posts => this.postsSubject.next(posts)),
      catchError(() => {
        this.popupService.showError('Sikertelen posztok betöltése');
        return of([]);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  createPost(groupName: string, description: string, image?: File): Observable<any> {
    this.loadingService.show();

    const formData = new FormData();
    const postData = { description };

    formData.append('post', JSON.stringify(postData));
    if (image) {
      formData.append('image', image);
    }

    return this.fetchService.postFormData(
      `/groups/name/${encodeURIComponent(groupName)}/newpost`,
      formData,
      { responseType: 'json', authType: AuthType.JWT }
    ).pipe(
      tap(() => {
        this.getGroupPosts(groupName).subscribe();
      }),
      catchError(error => {
        this.popupService.showError('Sikertelen poszt létrehozás');
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  getPostImage(postId: number): string {
    return `${this.fetchService.getBaseUrl()}/image/get/postimage?postId=${postId}`;
  }

  addCredit(postId: number): Observable<string> {
    return this.fetchService.post<string>(
      `/groups/post/add/credit`,
      {},
      {
        responseType: 'text',
        authType: AuthType.JWT,
        params: { postId: postId.toString() }
      }
    ).pipe(
      tap(() => {
        const currentPosts = this.postsSubject.value;
        const updatedPosts = currentPosts.map(post =>
          post.id === postId ? { ...post, creditCount: post.creditCount + 1 } : post
        );
        this.postsSubject.next(updatedPosts);
      }),
      catchError(error => {
        this.popupService.showError('Sikertelen kredit hozzáadás');
        return throwError(() => error);
      })
    );
  }
}