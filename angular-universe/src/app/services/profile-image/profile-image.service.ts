import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { FetchService, AuthType } from '../fetch/fetch.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {
  private defaultPfp = 'https://holydrive.org/api/view/f29ebc5fbc4f7e4f655ae6a3851549dd';
  private imageCache = new Map<string, string>();
  private imageRefreshTime = new BehaviorSubject<number>(Date.now());

  constructor(private fetchService: FetchService) { }

  getImageRefreshTime(): Observable<number> {
    return this.imageRefreshTime.asObservable();
  }

  getProfileImageUrl(userId?: string | number): string {
    if (!userId) return this.defaultPfp;

    const cacheKey = userId.toString();

    if (this.imageCache.has(cacheKey)) {
      return this.imageCache.get(cacheKey)!;
    }

    const imageUrl = `${this.fetchService.getBaseUrl()}/image/get/profilepicture?id=${userId}`;

    this.imageCache.set(cacheKey, imageUrl);

    return `${imageUrl}&t=${this.imageRefreshTime.getValue()}`;
  }

  refreshImages(): void {
    this.imageRefreshTime.next(Date.now());
    this.imageCache.clear();
  }

  uploadProfilePicture(imageFile: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', imageFile);

    return this.fetchService.postFormData('/image/upload/profilepicture', formData, {
      authType: AuthType.JWT
    }).pipe(
      tap(() => {
        this.refreshImages();
      })
    );
  }
}