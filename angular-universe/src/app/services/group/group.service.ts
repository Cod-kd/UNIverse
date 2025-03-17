import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { tap, map, catchError, timeout, retry, finalize } from 'rxjs/operators';
import { AuthType, FetchService } from '../fetch/fetch.service';
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

  constructor(
    private fetchService: FetchService,
    private popupService: PopupService,
    private loadingService: LoadingService
  ) {
  }

  fetchAllGroups(): Observable<Group[]> {
    this.loadingService.show();

    return this.fetchService.get<Group[]>(`${this.baseEndpoint}/search`, {
      params: { name: '' },
      responseType: 'json'
    }).pipe(
      timeout(12000),
      retry(1),
      tap(groups => {
        this.groupsSubject.next(groups.map(group => ({ ...group, isMember: false })));
      }),
      catchError(() => {
        this.popupService.showError('A csoportok betöltése sikertelen!');
        return of([]);
      }),
      finalize(() => this.loadingService.hide()),
      map(() => this.groupsSubject.value)
    );
  }

  checkGroupMembership(groupId: number): Observable<void> {
    return this.isGroupMember(groupId).pipe(
      tap(isMember => {
        const updatedGroups = this.groupsSubject.value.map(group =>
          group.id === groupId ? { ...group, isMember } : group
        );
        this.groupsSubject.next(updatedGroups);
      }),
      catchError(() => {
        return of(void 0);
      }),
      map(() => void 0)
    );
  }

  isGroupMember(groupId: number): Observable<boolean> {
    return this.fetchService.post<boolean>(`${this.baseEndpoint}/isGroupFollowed`, {
      groupId: groupId
    }, {
      responseType: 'json',
      authType: AuthType.JWT,
      showError: false
    }).pipe(
      catchError(() => {
        return of(false);
      })
    );
  }

  joinGroup(group: Group): Observable<any> {
    this.loadingService.show();

    return this.fetchService.post<any>(
      `${this.baseEndpoint}/name/${encodeURIComponent(group.name)}/follow`,
      {},
      {
        responseType: 'text',
        authType: AuthType.JWT
      }
    ).pipe(
      timeout(10000),
      tap({
        next: () => {
          const updatedGroups = this.groupsSubject.value.map(g =>
            g.id === group.id ? { ...g, isMember: true } : g
          );
          this.groupsSubject.next(updatedGroups);
          this.popupService.showSuccess('Sikeresen csatlakoztál a csoporthoz!');
        }
      }),
      catchError(error => {
        this.popupService.showError('Sikertelen csatlakozás a csoporthoz!');
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }

  leaveGroup(group: Group): Observable<any> {
    this.loadingService.show();

    return this.fetchService.post<any>(
      `${this.baseEndpoint}/name/${encodeURIComponent(group.name)}/unfollow`, {},
      { responseType: 'text', authType: AuthType.JWT }
    ).pipe(
      timeout(10000),
      tap({
        next: () => {
          const updatedGroups = this.groupsSubject.value.map(g =>
            g.id === group.id ? { ...g, isMember: false } : g
          );
          this.groupsSubject.next(updatedGroups);
          this.popupService.showSuccess('Sikeresen kiléptél a csoportból!');
        }
      }),
      catchError(error => {
        this.popupService.showError('Sikertelen kilépés a csoportból!');
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
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
      timeout(10000),
      tap(groups => {
        this.groupsSubject.next(groups.map(group => ({ ...group, isMember: false })));
      }),
      catchError(() => {
        return of([]);
      }),
      finalize(() => this.loadingService.hide()),
      map(() => this.groupsSubject.value)
    );
  }

  createGroup(groupName: string): Observable<any> {
    this.loadingService.show();

    return this.fetchService.post<any>(
      `${this.baseEndpoint}/create`,
      { groupName },
      {
        responseType: 'text',
        authType: AuthType.JWT
      }
    ).pipe(
      timeout(10000),
      tap((response) => {
        this.popupService.showSuccess(response);
        this.fetchAllGroups().subscribe();
      }),
      catchError(error => {
        this.popupService.showError('Sikertelen csoport létrehozás!');
        return throwError(() => error);
      }),
      finalize(() => this.loadingService.hide())
    );
  }
}