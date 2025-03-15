import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../../services/search/search.service';
import { ButtonComponent } from "../../general-components/button/button.component";
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ConstantsService } from '../../../services/constants/constants.service';
import { Subscription, forkJoin, Observable } from 'rxjs';
import { Role, ContactType, Category } from '../../../models/constants/constants.model';
import { UniversityService } from '../../../services/university/university.service';
import { DeleteProfileData, ContactInput } from '../../../models/self-profile/self-profile.model';
import { SelfProfileDataService } from '../../../services/self-profile-data/self-profile-data.service';
import { Profile } from '../../../models/profile/profile.model';

@Component({
  selector: 'app-self-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './self-profile.component.html',
  styleUrl: './self-profile.component.css'
})
export class SelfProfileComponent implements OnInit, OnDestroy {
  profile: Profile | null = null;
  originalProfile: Profile | null = null;

  universityName = '';
  facultyName = '';

  displayContacts: string[] = [];
  displayRoles: string[] = [];
  displayInterests: string[] = [];

  isSaving = false;
  isDeleting = false;
  deletePassword = '';
  showDeleteConfirm = false;

  editingDescription = false;
  tempDescription = '';

  userBirthDate = '';

  originalDescription = '';
  currentDescription = '';

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

  contactIcons: Record<string, string> = {
    'Facebook': 'fa-brands fa-facebook',
    'LinkedIn': 'fa-brands fa-linkedin',
    'GitHub': 'fa-brands fa-github',
    'TikTok': 'fa-brands fa-tiktok',
    'YouTube': 'fa-brands fa-youtube',
  };

  private subscriptions: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    private popupService: PopupService,
    private authService: AuthService,
    private router: Router,
    private constantsService: ConstantsService,
    private universityService: UniversityService,
    private profileDataService: SelfProfileDataService
  ) { }

  ngOnInit(): void {
    this.loadConstants();
    this.loadUserProfile();
  }

  private updateProfileDisplay(): void {
    if (!this.profile) return;

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

  private loadUserProfile(): void {
    const username = localStorage.getItem('username');
    if (!username) return;

    this.subscriptions.push(
      this.searchService.search(username).subscribe({
        error: () => this.popupService.showError('Hiba történt a profil betöltése során!')
      })
    );

    this.subscriptions.push(
      this.searchService.searchResults$.subscribe({
        next: (result: SearchResult) => {
          if (result && 'usersData' in result) {
            const profileData = result as unknown as Profile;
            profileData.contacts ??= [];
            profileData.roles ??= [];
            profileData.interests ??= [];

            this.profile = profileData;
            this.originalProfile = structuredClone(this.profile);
            this.originalDescription = this.profile.description || '';
            this.currentDescription = this.profile.description || '';

            this.userBirthDate = profileData.usersData.birthDate.replaceAll('-', '.');

            this.updateDisplayArrays();
            this.updateProfileDisplay();
          }
        },
        error: () => this.popupService.showError('Hiba történt a profil adatok feldolgozása során!')
      })
    );
  }

  getContactUsername(path: string): string {
    if (path.includes('://')) {
      const urlParts = path.split('/');
      return urlParts[urlParts.length - 1];
    }
    return path;
  }

  getContactIcon(type: string): string {
    return this.contactIcons[type] || 'fa-solid fa-link';
  }

  private loadConstants(): void {
    this.subscriptions.push(
      this.constantsService.getContactTypes$().subscribe({
        next: contactTypes => {
          this.contactTypes = contactTypes;
          this.contactOptions = contactTypes.map(ct => ct.name);
        },
        error: () => this.popupService.showError('Hiba történt az elérhetőség típusok betöltése során!')
      })
    );

    this.subscriptions.push(
      this.constantsService.getRoles$().subscribe({
        next: roles => {
          this.roles = roles;
          this.roleOptions = roles.map(r => r.name);
        },
        error: () => this.popupService.showError('Hiba történt a szerepkörök betöltése során!')
      })
    );

    this.subscriptions.push(
      this.constantsService.getCategories$().subscribe({
        next: categories => {
          this.categories = categories;
          this.interestOptions = categories.map(c => c.name);
        },
        error: () => this.popupService.showError('Hiba történt a kategóriák betöltése során!')
      })
    );
  }

  private updateDisplayArrays(): void {
    if (!this.profile) return;

    this.displayContacts = this.profileDataService.mapContactsToDisplayStrings(
      this.profile.contacts,
      this.contactTypes
    );

    this.displayRoles = this.profileDataService.mapRolesToDisplayStrings(
      this.profile.roles,
      this.roles
    );

    this.displayInterests = this.profileDataService.mapInterestsToDisplayStrings(
      this.profile.interests,
      this.categories
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getProfileImageSrc(): string {
    return 'images/default-pfp.jpg';
  }

  editDescription(): void {
    if (!this.profile) return;
    this.editingDescription = true;
    this.tempDescription = this.profile.description || '';
  }

  saveDescription(): void {
    if (!this.profile) return;
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
      const escapedDomain = selectedContact.domain.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const linkPattern = new RegExp(`^${selectedContact.protocol}://${escapedDomain}/[\\w-_.~/?#[\\]@!$&'()*+,;=]*$`);

      if (!linkPattern.test(this.contactInput.value)) {
        this.popupService.showError(`Hibás ${selectedContact.name} link formátum!`);
        return false;
      }
    } else {
      this.popupService.showError('Kérjük, válassz elérhetőség típust!');
      return false;
    }
    return true;
  }

  addContact(): void {
    if (!this.profile) return;

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
          contactTypeId: contactType.id,
          path: this.contactInput.value
        });
      } else {
        this.profile.contacts.push({
          contactTypeId: -1,
          path: this.contactInput.value
        });
      }

      this.contactInput = { type: '', value: '' };
      this.contactPlaceholder = '';
    } else {
      this.popupService.showError('Ez az elérhetőség már létezik.');
    }
  }

  removeContact(contact: string): void {
    if (!this.profile) return;

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
    if (!this.profile || !this.newRole) return;

    if (!this.displayRoles.includes(this.newRole)) {
      this.displayRoles.push(this.newRole);
      const role = this.roles.find(r => r.name === this.newRole);
      if (role) {
        this.profile.roles.push({
          roleId: role.id
        });
      } else {
        this.profile.roles.push({
          roleId: -1
        });
      }

      this.newRole = '';
    }
  }

  removeRole(role: string): void {
    if (!this.profile) return;

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
    if (!this.profile || !this.newInterest) return;

    if (!this.displayInterests.includes(this.newInterest)) {
      this.displayInterests.push(this.newInterest);

      const category = this.categories.find(c => c.name === this.newInterest);
      if (category) {
        this.profile.interests.push({
          categoryId: category.id
        });
      } else {
        this.profile.interests.push({
          categoryId: -1
        });
      }

      this.newInterest = '';
    }
  }

  removeInterest(interest: string): void {
    if (!this.profile) return;

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
    if (!this.profile || !this.originalProfile) {
      this.popupService.showError("Profil adatok hiányoznak!");
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      this.popupService.showError("Felhasználó azonosító hiányzik!");
      return;
    }

    const hasDescriptionChanges = this.profile.description !== this.originalProfile.description;
    const hasContactChanges = JSON.stringify(this.profile.contacts) !== JSON.stringify(this.originalProfile.contacts);
    const hasRoleChanges = JSON.stringify(this.profile.roles) !== JSON.stringify(this.originalProfile.roles);
    const hasInterestChanges = JSON.stringify(this.profile.interests) !== JSON.stringify(this.originalProfile.interests);

    if (!hasDescriptionChanges && !hasContactChanges && !hasRoleChanges && !hasInterestChanges) {
      this.popupService.showError("Nincs új menthető adat!");
      return;
    }

    this.isSaving = true;
    const parsedUserId = parseInt(userId);
    const observables: Observable<any>[] = [];

    const backendContacts = this.profileDataService.mapContactsToDisplayStrings(
      this.originalProfile.contacts,
      this.contactTypes
    );

    const backendRoles = this.profileDataService.mapRolesToDisplayStrings(
      this.originalProfile.roles,
      this.roles
    );

    const backendInterests = this.profileDataService.mapInterestsToDisplayStrings(
      this.originalProfile.interests,
      this.categories
    );

    if (hasDescriptionChanges) {
      observables.push(this.profileDataService.updateDescription(parsedUserId, this.profile.description || ''));
    }

    if (hasContactChanges) {
      observables.push(this.profileDataService.processContactChanges(
        parsedUserId,
        this.displayContacts,
        backendContacts,
        this.contactTypes
      ));
    }

    if (hasRoleChanges) {
      observables.push(this.profileDataService.processRoleChanges(
        parsedUserId,
        this.displayRoles,
        backendRoles,
        this.roles
      ));
    }

    if (hasInterestChanges) {
      observables.push(this.profileDataService.processInterestChanges(
        parsedUserId,
        this.displayInterests,
        backendInterests,
        this.categories
      ));
    }

    forkJoin(observables)
      .subscribe({
        next: () => {
          this.originalProfile = structuredClone(this.profile);
          this.popupService.showSuccess("Sikeres módosítás!");
          this.isSaving = false;
        },
        error: (error) => {
          console.error('Profile update failed:', error);
          this.popupService.showError(error?.message || "Hiba történt a mentés során!");
          this.isSaving = false;
        }
      });
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

    this.profileDataService.deleteProfile(deleteData).subscribe({
      next: () => {
        this.popupService.showSuccess("Sikeres fiók törlés!");

        this.authService.logout();
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        this.router.navigate(['/']);

        this.isDeleting = false;
        this.showDeleteConfirm = false;
      },
      error: (error) => {
        console.error('Profile deletion error:', error);
        this.isDeleting = false;

        const errorMessage = error?.error?.message || "Hiba történt a fiók törlése során!";
        this.popupService.showError(errorMessage);
      }
    });
  }
}