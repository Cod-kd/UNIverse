import { Injectable } from '@angular/core';
import { AuthType, FetchService } from '../fetch/fetch.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Role, ContactType, Category } from '../../models/constants/constants.model';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {
  private roles$ = new BehaviorSubject<Role[]>([]);
  private contactTypes$ = new BehaviorSubject<ContactType[]>([]);
  private categories$ = new BehaviorSubject<Category[]>([]);

  constructor(private fetchService: FetchService) {
    this.loadAllConstants();
  }

  loadAllConstants(): void {
    this.fetchRoles();
    this.fetchContactTypes();
    this.fetchCategories();
  }

  getRoles$(): Observable<Role[]> {
    return this.roles$.asObservable();
  }

  getContactTypes$(): Observable<ContactType[]> {
    return this.contactTypes$.asObservable();
  }

  getCategories$(): Observable<Category[]> {
    return this.categories$.asObservable();
  }

  getRolesSnapshot(): Role[] {
    return this.roles$.getValue();
  }

  getContactTypesSnapshot(): ContactType[] {
    return this.contactTypes$.getValue();
  }

  getCategoriesSnapshot(): Category[] {
    return this.categories$.getValue();
  }

  private fetchRoles(): void {
    this.fetchService.get<Role[]>('/user/common/roles', { authType: AuthType.NONE }).subscribe({
      next: (data) => this.roles$.next(data),
      error: () => {
        if (this.roles$.getValue().length === 0) {
          this.roles$.next([]);
        }
      }
    });
  }

  private fetchContactTypes(): void {
    this.fetchService.get<ContactType[]>('/user/common/contacttypes', { authType: AuthType.NONE }).subscribe({
      next: (data) => this.contactTypes$.next(data),
      error: () => {
        if (this.contactTypes$.getValue().length === 0) {
          this.contactTypes$.next([]);
        }
      }
    });
  }

  private fetchCategories(): void {
    this.fetchService.get<Category[]>('/user/common/categories', { authType: AuthType.NONE }).subscribe({
      next: (data) => this.categories$.next(data),
      error: () => {
        if (this.categories$.getValue().length === 0) {
          this.categories$.next([]);
        }
      }
    });
  }
}