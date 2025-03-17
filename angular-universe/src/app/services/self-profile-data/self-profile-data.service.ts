import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FetchService, AuthType } from '../fetch/fetch.service';
import { ContactType, Role, Category } from '../../models/constants/constants.model';
import { DeleteProfileData } from '../../models/self-profile/self-profile.model';

@Injectable({
  providedIn: 'root'
})
export class SelfProfileDataService {
  constructor(private fetchService: FetchService) { }

  updateDescription(userId: number, description: string): Observable<any> {
    return this.fetchService.post('/user/update/desc', { description, userId }, {
      responseType: 'text'
    });
  }

  addContact(userId: number, contactTypeId: number, path: string): Observable<any> {
    return this.fetchService.post('/user/add/contact', { userId, contactTypeId, path }, {
      responseType: 'text'
    });
  }

  addRole(userId: number, roleId: number): Observable<any> {
    return this.fetchService.post('/user/add/role', { userId, roleId }, {
      responseType: 'text'
    });
  }

  addInterest(userId: number, categoryId: number): Observable<any> {
    return this.fetchService.post('/user/add/interest', { userId, categoryId }, {
      responseType: 'text'
    });
  }

  deleteProfile(deleteData: DeleteProfileData): Observable<any> {
    return this.fetchService.post('/auth/delete', deleteData, {
      responseType: 'text',
      authType: AuthType.NONE
    });
  }

  processContactChanges(userId: number,
    displayContacts: string[],
    backendContacts: string[],
    contactTypes: ContactType[]): Observable<any> {
    const newContacts = displayContacts.filter(
      (contact: string) => !backendContacts.includes(contact)
    );

    if (newContacts.length === 0) {
      return of(null);
    }

    const observables: Observable<any>[] = [];

    for (const contactLabel of newContacts) {
      const [typeName, path] = contactLabel.split(': ');
      const contactType = contactTypes.find(ct => ct.name === typeName);

      if (!contactType) continue;

      observables.push(this.addContact(userId, contactType.id, path).pipe(
        catchError(() => {
          return of(null);
        })
      ));
    }

    return forkJoin(observables);
  }

  processRoleChanges(userId: number,
    displayRoles: string[],
    backendRoles: string[],
    roles: Role[]): Observable<any> {
    const newRoles = displayRoles.filter(role => !backendRoles.includes(role));

    if (newRoles.length === 0) {
      return of(null);
    }

    const observables: Observable<any>[] = [];

    for (const roleName of newRoles) {
      const role = roles.find(r => r.name === roleName);
      if (!role) continue;

      observables.push(this.addRole(userId, role.id).pipe(
        catchError(() => {
          return of(null);
        })
      ));
    }

    return forkJoin(observables);
  }

  processInterestChanges(userId: number,
    displayInterests: string[],
    backendInterests: string[],
    categories: Category[]): Observable<any> {
    const newInterests = displayInterests.filter(
      interest => !backendInterests.includes(interest)
    );

    if (newInterests.length === 0) {
      return of(null);
    }

    const observables: Observable<any>[] = [];

    for (const interestName of newInterests) {
      const category = categories.find(c => c.name === interestName);
      if (!category) continue;

      observables.push(this.addInterest(userId, category.id).pipe(
        catchError(() => {
          return of(null);
        })
      ));
    }

    return forkJoin(observables);
  }

  mapContactsToDisplayStrings(contacts: any[], contactTypes: ContactType[]): string[] {
    return contacts.map((contact: any) => {
      if (typeof contact === 'string') return contact;

      const contactType = contactTypes.find(ct => ct.id === contact.contactTypeId);
      return contactType ? `${contactType.name}: ${contact.path}` : `${contact.contactTypeId}: ${contact.path}`;
    });
  }

  mapRolesToDisplayStrings(roles: any[], allRoles: Role[]): string[] {
    return roles.map((role: any) => {
      if (typeof role === 'string') return role;

      const roleObj = allRoles.find(r => r.id === role.roleId);
      return roleObj ? roleObj.name : `${role.roleId}`;
    });
  }

  mapInterestsToDisplayStrings(interests: any[], categories: Category[]): string[] {
    return interests.map((interest: any) => {
      if (typeof interest === 'string') return interest;

      const category = categories.find(c => c.id === interest.categoryId);
      return category ? category.name : `${interest.categoryId}`;
    });
  }
}