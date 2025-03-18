import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FetchService, AuthType } from '../fetch/fetch.service';
import { ContactType, Role, Category } from '../../models/constants/constants.model';
import { DeleteProfileData } from '../../models/self-profile/self-profile.model';
import { ProfileImageService } from '../profile-image/profile-image.service';

@Injectable({
  providedIn: 'root'
})
export class SelfProfileDataService {
  constructor(
    private fetchService: FetchService,
    private profileImageService: ProfileImageService
  ) { }

  updateDescription(description: string): Observable<any> {
    return this.fetchService.post('/user/update/desc', { description }, {
      responseType: 'text',
      authType: AuthType.JWT
    });
  }

  addContact(contactTypeId: number, path: string): Observable<any> {
    return this.fetchService.post('/user/add/contact', { contactTypeId, path }, {
      responseType: 'text',
      authType: AuthType.JWT
    });
  }

  addRole(roleId: number): Observable<any> {
    return this.fetchService.post('/user/add/role', { roleId }, {
      responseType: 'text',
      authType: AuthType.JWT
    });
  }

  addInterest(categoryId: number): Observable<any> {
    return this.fetchService.post('/user/add/interest', { categoryId }, {
      responseType: 'text',
      authType: AuthType.JWT
    });
  }

  uploadProfilePicture(imageFile: File): Observable<any> {
    return this.profileImageService.uploadProfilePicture(imageFile);
  }

  getProfilePictureUrl(): string {
    const userId = localStorage.getItem('userId');
    return this.profileImageService.getProfileImageUrl(userId || undefined);
  }

  deleteProfile(deleteData: DeleteProfileData): Observable<any> {
    return this.fetchService.post('/auth/delete', deleteData, {
      responseType: 'text',
      authType: AuthType.NONE
    });
  }

  processContactChanges(
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

      observables.push(this.addContact(contactType.id, path).pipe(
        catchError(() => {
          return of(null);
        })
      ));
    }

    return forkJoin(observables);
  }

  processRoleChanges(
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

      observables.push(this.addRole(role.id).pipe(
        catchError(() => {
          return of(null);
        })
      ));
    }

    return forkJoin(observables);
  }

  processInterestChanges(
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

      observables.push(this.addInterest(category.id).pipe(
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