import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../../services/search/search.service';
import { ButtonComponent } from "../../general-components/button/button.component";
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { FetchService } from '../../../services/fetch/fetch.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ConstantsService } from '../../../services/constants/constants.service';
import { Subscription } from 'rxjs';
import { Role, ContactType, Category } from '../../../models/constants/constants.model';
import { UniversityService } from '../../../services/university/university.service';
import { DeleteProfileData, ContactInput } from '../../../models/self-profile/self-profile.model';

@Component({
  selector: 'app-self-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './self-profile.component.html',
  styleUrl: './self-profile.component.css'
})
export class SelfProfileComponent implements OnInit, OnDestroy {
  profile: any = null;
  originalProfile: any = null;

  universityName: string = '';
  facultyName: string = '';

  displayContacts: string[] = [];
  displayRoles: string[] = [];
  displayInterests: string[] = [];

  isSaving: boolean = false;
  isDeleting: boolean = false;
  deletePassword: string = '';
  showDeleteConfirm: boolean = false;

  editingDescription = false;
  tempDescription = '';

  userBirthDate = '';

  originalDescription: string = '';
  currentDescription: string = '';

  contactInput: ContactInput = { type: '', value: '' };
  contactPlaceholder = '';
  newContact = '';
  newRole = '';
  newInterest = '';

  contactTypes: ContactType[] = [];
  roles: Role[] = [];
  categories: Category[] = [];

  contactOptions: string[] = [];
  roleOptions: string[] = [];
  interestOptions: string[] = [];

  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  phonePattern = /^\+?[0-9]{10,15}$/;

  private subscriptions: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    private popupService: PopupService,
    private fetchService: FetchService,
    private authService: AuthService,
    private router: Router,
    private constantsService: ConstantsService,
    private universityService: UniversityService
  ) { }

  private updateProfileDisplay(): void {
    this.universityName = this.universityService.getUniversityName(
      this.profile.usersData.universityName
    );

    if (this.profile.faculty) {
      this.facultyName = this.universityService.getFacultyNameByAbbreviation(
        this.profile.usersData.universityName,
        this.profile.faculty
      );
    } else {
      this.facultyName = '';
    }
  }

  ngOnInit(): void {
    this.loadConstants();

    const username = localStorage.getItem('username');
    if (username) {
      this.searchService.search(username).subscribe();
    }

    this.subscriptions.push(
      this.searchService.searchResults$.subscribe((result: SearchResult) => {
        if (result && 'usersData' in result) {
          if (!result.contacts) result.contacts = [];
          if (!result.roles) result.roles = [];
          if (!result.interests) result.interests = [];

          this.profile = result;
          this.originalProfile = JSON.parse(JSON.stringify(this.profile));
          this.originalDescription = this.currentDescription;
          this.userBirthDate = this.profile.usersData.birthDate.replaceAll('-', '.');

          this.updateDisplayArrays();
          this.updateProfileDisplay();
        }
      })
    );
  }

  private loadConstants(): void {
    this.subscriptions.push(
      this.constantsService.getContactTypes$().subscribe(contactTypes => {
        this.contactTypes = contactTypes;
        this.contactOptions = contactTypes.map(ct => ct.name);
      })
    );

    this.subscriptions.push(
      this.constantsService.getRoles$().subscribe(roles => {
        this.roles = roles;
        this.roleOptions = roles.map(r => r.name);
      })
    );

    this.subscriptions.push(
      this.constantsService.getCategories$().subscribe(categories => {
        this.categories = categories;
        this.interestOptions = categories.map(c => c.name);
      })
    );
  }

  private updateDisplayArrays(): void {
    this.displayContacts = this.profile.contacts.map((contact: any) => {
      if (typeof contact === 'string') return contact;

      const contactType = this.contactTypes.find(ct => ct.id === contact.contactTypeId);
      return contactType ? `${contactType.name}: ${contact.path}` : `${contact.contactTypeId}: ${contact.path}`;
    });

    this.displayRoles = this.profile.roles.map((role: any) => {
      if (typeof role === 'string') return role;

      const roleObj = this.roles.find(r => r.id === role.roleId);
      return roleObj ? roleObj.name : `${role.roleId}`;
    });

    this.displayInterests = this.profile.interests.map((interest: any) => {
      if (typeof interest === 'string') return interest;

      const category = this.categories.find(c => c.id === interest.categoryId);
      return category ? category.name : `${interest.categoryId}`;
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getProfileImageSrc(): string {
    return 'images/cat-pfp.jpg';
  }

  editDescription(): void {
    this.editingDescription = true;
    this.tempDescription = this.profile.description || '';
  }

  saveDescription(): void {
    this.profile.description = this.tempDescription;
    this.currentDescription = this.tempDescription;
    this.editingDescription = false;
  }

  updateContactPlaceholder(): void {
    this.contactInput.value = '';
    this.contactPlaceholder = this.getContactPlaceholder();
  }

  getContactPlaceholder(): string {
    const selectedContact = this.contactTypes.find(c => c.name === this.contactInput.type);

    if (selectedContact) {
      return `${selectedContact.protocol}://${selectedContact.domain}/username`;
    } else if (this.contactInput.type === 'Email') {
      return 'example@domain.com';
    } else if (this.contactInput.type === 'Phone Number') {
      return '+36201234567';
    }
    return '';
  }

  validateContact(): boolean {
    if (!this.contactInput.value) {
      this.popupService.showError('Kérjük, add meg az elérhetőség értékét!');
      return false;
    }

    const selectedContact = this.contactTypes.find(c => c.name === this.contactInput.type);

    if (selectedContact) {
      const linkPattern = new RegExp(`^${selectedContact.protocol}://${selectedContact.domain.replace('.', '\\.')}/[\\w-_.~/?#[\\]@!$&'()*+,;=]*$`);
      if (!linkPattern.test(this.contactInput.value)) {
        this.popupService.showError(`Hibás ${selectedContact.name} link formátum!`);
        return false;
      }
    } else if (this.contactInput.type === 'Email') {
      if (!this.emailPattern.test(this.contactInput.value)) {
        this.popupService.showError('Hibás e-mail formátum!');
        return false;
      }
    } else if (this.contactInput.type === 'Phone Number') {
      if (!this.phonePattern.test(this.contactInput.value)) {
        this.popupService.showError('Hibás telefonszám formátum!');
        return false;
      }
    } else {
      this.popupService.showError('Kérjük, válassz elérhetőség típust!');
      return false;
    }
    return true;
  }

  addContact(): void {
    if (!this.contactInput.type) {
      this.popupService.showError('Kérjük, válassz elérhetőség típust!');
      return;
    }

    if (!this.validateContact()) return;

    const formattedContact = `${this.contactInput.type}: ${this.contactInput.value}`;

    if (!this.displayContacts.includes(formattedContact)) {
      this.displayContacts.push(formattedContact);

      const contactType = this.contactTypes.find(ct => ct.name === this.contactInput.type);
      if (contactType) {
        this.profile.contacts.push({
          userId: this.profile.userId,
          contactTypeId: contactType.id,
          path: this.contactInput.value
        });
      } else {
        this.profile.contacts.push(formattedContact);
      }

      this.contactInput = { type: '', value: '' };
      this.contactPlaceholder = '';
    } else {
      this.popupService.showError('Ez az elérhetőség már létezik.');
    }
  }

  removeContact(contact: string): void {
    this.displayContacts = this.displayContacts.filter(c => c !== contact);

    const [typeName, path] = contact.split(': ');
    const contactType = this.contactTypes.find(ct => ct.name === typeName);

    if (contactType) {
      this.profile.contacts = this.profile.contacts.filter((c: any) => {
        if (typeof c === 'string') return c !== contact;
        return !(c.contactTypeId === contactType.id && c.path === path);
      });
    } else {
      this.profile.contacts = this.profile.contacts.filter((c: any) => {
        if (typeof c === 'string') return c !== contact;
        return true;
      });
    }
  }

  addRole(): void {
    if (!this.newRole) return;

    if (!this.displayRoles.includes(this.newRole)) {
      this.displayRoles.push(this.newRole);
      const role = this.roles.find(r => r.name === this.newRole);
      if (role) {
        this.profile.roles.push({
          userId: this.profile.userId,
          roleId: role.id
        });
      } else {
        this.profile.roles.push(this.newRole);
      }

      this.newRole = '';
    }
  }

  removeRole(role: string): void {
    this.displayRoles = this.displayRoles.filter(r => r !== role);
    const roleObj = this.roles.find(r => r.name === role);

    if (roleObj) {
      this.profile.roles = this.profile.roles.filter((r: any) => {
        if (typeof r === 'string') return r !== role;
        return r.roleId !== roleObj.id;
      });
    } else {
      this.profile.roles = this.profile.roles.filter((r: any) => {
        if (typeof r === 'string') return r !== role;
        return true;
      });
    }
  }

  addInterest(): void {
    if (!this.newInterest) return;

    if (!this.displayInterests.includes(this.newInterest)) {
      this.displayInterests.push(this.newInterest);

      const category = this.categories.find(c => c.name === this.newInterest);
      if (category) {
        this.profile.interests.push({
          userId: this.profile.userId,
          categoryId: category.id
        });
      } else {
        this.profile.interests.push(this.newInterest);
      }

      this.newInterest = '';
    }
  }

  removeInterest(interest: string): void {
    this.displayInterests = this.displayInterests.filter(i => i !== interest);

    const category = this.categories.find(c => c.name === interest);

    if (category) {
      this.profile.interests = this.profile.interests.filter((i: any) => {
        if (typeof i === 'string') return i !== interest;
        return i.categoryId !== category.id;
      });
    } else {
      this.profile.interests = this.profile.interests.filter((i: any) => {
        if (typeof i === 'string') return i !== interest;
        return true;
      });
    }
  }

  saveChanges(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const hasDescriptionChanges = this.profile.description !== this.originalProfile?.description;
    const hasContactChanges = JSON.stringify(this.profile.contacts) !== JSON.stringify(this.originalProfile?.contacts);
    const hasRoleChanges = JSON.stringify(this.profile.roles) !== JSON.stringify(this.originalProfile?.roles);
    const hasInterestChanges = JSON.stringify(this.profile.interests) !== JSON.stringify(this.originalProfile?.interests);

    if (!hasDescriptionChanges && !hasContactChanges && !hasRoleChanges && !hasInterestChanges) {
      this.popupService.showError("Nincs új menthető adat!");
      return;
    }

    this.isSaving = true;
    const parsedUserId = parseInt(userId);
    const promises: Promise<any>[] = [];

    if (hasDescriptionChanges) {
      const descPromise = this.updateDescription(parsedUserId);
      promises.push(descPromise);
    }

    if (hasContactChanges) {
      const contactPromise = this.updateContacts(parsedUserId);
      promises.push(contactPromise);
    }

    if (hasRoleChanges) {
      const rolePromise = this.updateRoles(parsedUserId);
      promises.push(rolePromise);
    }

    if (hasInterestChanges) {
      const interestPromise = this.updateInterests(parsedUserId);
      promises.push(interestPromise);
    }

    Promise.all(promises)
      .then(() => {
        this.originalProfile = JSON.parse(JSON.stringify(this.profile));
        this.isSaving = false;
        this.popupService.showSuccess("Sikeres módosítás!");
      })
      .catch(() => {
        this.isSaving = false;
      });
  }

  private updateDescription(userId: number): Promise<any> {
    const requestBody = {
      description: this.profile.description,
      userId
    };

    return new Promise((resolve, reject) => {
      this.fetchService.post('/user/update/desc', requestBody, {
        responseType: 'text'
      }).subscribe({
        next: () => resolve(null),
        error: (error) => reject(error)
      });
    });
  }

  private updateContacts(userId: number): Promise<any> {
    const backendContacts = this.originalProfile.contacts.map((c: any) => {
      if (typeof c === 'string') return c;

      const contactType = this.contactTypes.find(ct => ct.id === c.contactTypeId);
      return contactType ? `${contactType.name}: ${c.path}` : `${c.contactTypeId}: ${c.path}`;
    });

    const newContacts = this.displayContacts.filter(
      (contact: string) => !backendContacts.includes(contact)
    );

    const promises: Promise<any>[] = [];

    for (const contactLabel of newContacts) {
      const [typeName, path] = contactLabel.split(': ');
      const contactType = this.contactTypes.find(ct => ct.name === typeName);

      if (!contactType) continue;

      const contactData = {
        userId,
        contactTypeId: contactType.id,
        path
      };

      const promise = new Promise((resolve, reject) => {
        this.fetchService.post('/user/add/contact', contactData, {
          responseType: 'text'
        }).subscribe({
          next: () => resolve(null),
          error: (error) => reject(error)
        });
      });

      promises.push(promise);
    }

    return Promise.all(promises);
  }

  private updateRoles(userId: number): Promise<any> {
    const backendRoles = this.originalProfile.roles.map((r: any) => {
      if (typeof r === 'string') return r;

      const role = this.roles.find(role => role.id === r.roleId);
      return role ? role.name : `${r.roleId}`;
    });

    const newRoles = this.displayRoles.filter(
      (role: string) => !backendRoles.includes(role)
    );

    const promises: Promise<any>[] = [];

    for (const roleName of newRoles) {
      const role = this.roles.find(r => r.name === roleName);
      if (!role) continue;

      const roleData = {
        userId,
        roleId: role.id
      };

      const promise = new Promise((resolve, reject) => {
        this.fetchService.post('/user/add/role', roleData, {
          responseType: 'text'
        }).subscribe({
          next: () => resolve(null),
          error: (error) => reject(error)
        });
      });

      promises.push(promise);
    }

    return Promise.all(promises);
  }

  private updateInterests(userId: number): Promise<any> {
    const backendInterests = this.originalProfile.interests.map((i: any) => {
      if (typeof i === 'string') return i;

      const category = this.categories.find(c => c.id === i.categoryId);
      return category ? category.name : `${i.categoryId}`;
    });

    const newInterests = this.displayInterests.filter(
      (interest: string) => !backendInterests.includes(interest)
    );

    const promises: Promise<any>[] = [];

    for (const interestName of newInterests) {
      const category = this.categories.find(c => c.name === interestName);
      if (!category) continue;

      const interestData = {
        userId,
        categoryId: category.id
      };

      const promise = new Promise((resolve, reject) => {
        this.fetchService.post('/user/add/interest', interestData, {
          responseType: 'text'
        }).subscribe({
          next: () => resolve(null),
          error: (error) => reject(error)
        });
      });

      promises.push(promise);
    }

    return Promise.all(promises);
  }

  confirmDeleteProfile(): void {
    this.showDeleteConfirm = true;
    this.deletePassword = '';
  }

  cancelDeleteProfile(): void {
    this.showDeleteConfirm = false;
    this.deletePassword = '';
  }

  proceedWithDeleteProfile(): void {
    const username = localStorage.getItem('username');

    if (!username) {
      this.popupService.showError("Felhasználó nem található!");
      return;
    }

    if (!this.deletePassword) {
      this.popupService.showError("Kérjük, add meg a jelszavad!");
      return;
    }

    this.isDeleting = true;

    const deleteData: DeleteProfileData = {
      usernameIn: username,
      passwordIn: this.deletePassword
    };

    this.fetchService.post('/user/delete', deleteData, {
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.popupService.showSuccess("Sikeres fiók törlés!");
        this.authService.logout();
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        this.router.navigate(['/']);
        this.isDeleting = false;
        this.showDeleteConfirm = false;
      },
      error: () => {
        this.isDeleting = false;
      }
    });
  }
}