import { Injectable } from '@angular/core';
import { FetchService } from '../fetch/fetch.service';
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
    this.fetchService.get<Role[]>('/user/common/roles').subscribe({
      next: (data) => this.roles$.next(data)
    });
  }

  private fetchContactTypes(): void {
    this.fetchService.get<ContactType[]>('/user/common/contacttypes').subscribe({
      next: (data) => this.contactTypes$.next(data)
    });
  }

  private fetchCategories(): void {
    this.fetchService.get<Category[]>('/user/common/categories').subscribe({
      next: (data) => this.categories$.next(data)
    });
  }
}