import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, map, tap } from 'rxjs';
import { FetchService } from '../fetch/fetch.service';
import { Group } from '../../models/group/group.model';
import { PopupService } from '../popup-message/popup-message.service';
import { LoadingService } from '../loading/loading.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private groupsSubject = new BehaviorSubject<Group[]>([]);
  groups$ = this.groupsSubject.asObservable();

  private baseEndpoint = '/groups';
  private currentUserId: string | null = null;

  constructor(
    private fetchService: FetchService,
    private popupService: PopupService,
    private loadingService: LoadingService
  ) {
    this.currentUserId = localStorage.getItem('userId');
  }

  fetchAllGroups(): Observable<Group[]> {
    this.loadingService.show();

    return this.fetchService.get<Group[]>(`${this.baseEndpoint}/search`, {
      params: { name: '' },
      responseType: 'json'
    }).pipe(
      tap(groups => {
        if (this.currentUserId) {
          this.checkGroupMemberships(groups);
        } else {
          this.groupsSubject.next(groups.map(group => ({ ...group, isMember: false })));
        }
      }),
      tap(() => this.loadingService.hide()),
      map(() => this.groupsSubject.value)
    );
  }

  private checkGroupMemberships(groups: Group[]): void {
    if (!this.currentUserId) return;

    const membershipChecks = groups.map(group =>
      this.isGroupMember(group.id).pipe(
        map(isMember => ({ ...group, isMember }))
      )
    );

    forkJoin(membershipChecks).subscribe({
      next: (groupsWithMembership) => {
        this.groupsSubject.next(groupsWithMembership);
      },
      error: () => {
        this.groupsSubject.next(groups.map(group => ({ ...group, isMember: false })));
      }
    });
  }

  isGroupMember(groupId: number): Observable<boolean> {
    if (!this.currentUserId) return new Observable<boolean>(observer => {
      observer.next(false);
      observer.complete();
    });

    return this.fetchService.post<boolean>(`${this.baseEndpoint}/isGroupFollowed`, {
      userId: this.currentUserId,
      groupId: groupId
    }, {
      responseType: 'json',
      showError: false
    });
  }

  joinGroup(group: Group): Observable<any> {
    if (!this.currentUserId) {
      this.popupService.showError('Jelentkezz be a csoporthoz való csatlakozáshoz!');
      return new Observable(observer => observer.error('Not logged in'));
    }

    this.loadingService.show();

    return this.fetchService.post<any>(
      `${this.baseEndpoint}/name/${encodeURIComponent(group.name)}/follow`,
      { userId: this.currentUserId },
      { responseType: 'text' }
    ).pipe(
      tap({
        next: () => {
          const updatedGroups = this.groupsSubject.value.map(g =>
            g.id === group.id ? { ...g, isMember: true } : g
          );
          this.groupsSubject.next(updatedGroups);
          this.popupService.showSuccess('Sikeresen csatlakoztál a csoporthoz!');
        }
      }),
      tap(() => this.loadingService.hide())
    );
  }

  leaveGroup(group: Group): Observable<any> {
    if (!this.currentUserId) {
      return new Observable(observer => observer.error('Not logged in'));
    }

    this.loadingService.show();

    return this.fetchService.post<any>(
      `${this.baseEndpoint}/name/${encodeURIComponent(group.name)}/unfollow`,
      { userId: this.currentUserId },
      { responseType: 'text' }
    ).pipe(
      tap({
        next: () => {
          const updatedGroups = this.groupsSubject.value.map(g =>
            g.id === group.id ? { ...g, isMember: false } : g
          );
          this.groupsSubject.next(updatedGroups);
          this.popupService.showSuccess('Sikeresen kiléptél a csoportból!');
        }
      }),
      tap(() => this.loadingService.hide())
    );
  }

  getGroupById(groupId: number): Group | undefined {
    return this.groupsSubject.value.find(group => group.id === groupId);
  }

  searchGroups(searchTerm: string): Observable<Group[]> {
    this.loadingService.show();

    return this.fetchService.get<Group[]>(`${this.baseEndpoint}/search`, {
      params: { name: searchTerm },
      responseType: 'json'
    }).pipe(
      tap(groups => {
        if (this.currentUserId) {
          this.checkGroupMemberships(groups);
        } else {
          this.groupsSubject.next(groups.map(group => ({ ...group, isMember: false })));
        }
      }),
      tap(() => this.loadingService.hide()),
      map(() => this.groupsSubject.value)
    );
  }
}