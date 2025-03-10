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

interface ContactInput {
  type: string;
  value: string;
}

interface DeleteProfileData {
  usernameIn: string;
  passwordIn: string;
}

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

  // Data from APIs
  contactTypes: ContactType[] = [];
  roles: Role[] = [];
  categories: Category[] = [];

  // Options for dropdowns
  contactOptions: string[] = [];
  roleOptions: string[] = [];
  interestOptions: string[] = [];

  // Validation patterns
  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  phonePattern = /^\+?[0-9]{10,15}$/;

  private subscriptions: Subscription[] = [];

  constructor(
    private searchService: SearchService,
    private popupService: PopupService,
    private fetchService: FetchService,
    private authService: AuthService,
    private router: Router,
    private constantsService: ConstantsService
  ) { }

  ngOnInit(): void {
    // Load user profile
    this.subscriptions.push(
      this.searchService.searchResults$.subscribe((result: SearchResult) => {
        if (result && 'usersData' in result) {
          result.contacts = result.contacts || [];
          result.roles = result.roles || [];
          result.interests = result.interests || [];

          this.originalDescription = this.currentDescription;
          this.profile = result;
          this.originalProfile = JSON.parse(JSON.stringify(this.profile));
          this.userBirthDate = this.profile.usersData.birthDate.replaceAll('-', '.');
        }
      })
    );

    // Load constants data
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

    // Fetch user data
    const username = localStorage.getItem('username');
    if (username) {
      this.searchService.search(username).subscribe();
    }
  }

  ngOnDestroy(): void {
    // Clean up all subscriptions
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
    // Find the selected contact type
    const selectedContact = this.contactTypes.find(c => c.name === this.contactInput.type);

    if (selectedContact) {
      // Return a placeholder based on the contact type's domain
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
      // Validate against a social URL pattern
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

    if (!this.profile.contacts.includes(formattedContact)) {
      this.profile.contacts.push(formattedContact);
      this.contactInput = { type: '', value: '' };
      this.contactPlaceholder = '';
    } else {
      this.popupService.showError('Ez az elérhetőség már létezik.');
    }
  }

  removeContact(contact: string): void {
    this.profile.contacts = this.profile.contacts.filter((c: string) => c !== contact);
  }

  addRole(): void {
    if (this.newRole && !this.profile.roles.includes(this.newRole)) {
      this.profile.roles.push(this.newRole);
      this.newRole = '';
    }
  }

  removeRole(role: string): void {
    this.profile.roles = this.profile.roles.filter((r: string) => r !== role);
  }

  addInterest(): void {
    if (this.newInterest && !this.profile.interests.includes(this.newInterest)) {
      this.profile.interests.push(this.newInterest);
      this.newInterest = '';
    }
  }

  removeInterest(interest: string): void {
    this.profile.interests = this.profile.interests.filter((i: string) => i !== interest);
  }

  saveChanges(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    // Check if there are any changes to save
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

    // Save description if changed
    if (hasDescriptionChanges) {
      const descPromise = this.updateDescription(parsedUserId);
      promises.push(descPromise);
    }

    // Process contacts if changed
    if (hasContactChanges) {
      const contactPromise = this.updateContacts(parsedUserId);
      promises.push(contactPromise);
    }

    // Process roles if changed
    if (hasRoleChanges) {
      const rolePromise = this.updateRoles(parsedUserId);
      promises.push(rolePromise);
    }

    // Process interests if changed
    if (hasInterestChanges) {
      const interestPromise = this.updateInterests(parsedUserId);
      promises.push(interestPromise);
    }

    // Handle all promises
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
    // Compare original and current contacts to find new ones
    const originalContactLabels = this.originalProfile?.contacts || [];
    const currentContactLabels = this.profile.contacts || [];

    // Find new contacts that need to be added
    const newContacts = currentContactLabels.filter(
      (contact: string) => !originalContactLabels.includes(contact)
    );

    if (newContacts.length === 0) return Promise.resolve();

    const contactPromises = newContacts.map((contactLabel: string) => {
      // Parse contact label (e.g., "Facebook: johndoe")
      const [typeName, path] = contactLabel.split(': ');

      // Find the contact type ID
      const contactType = this.contactTypes.find(ct => ct.name === typeName);
      if (!contactType) return Promise.resolve(); // Skip if contact type not found

      const contactData = {
        userId,
        contactTypeId: contactType.id,
        path
      };

      return new Promise((resolve, reject) => {
        this.fetchService.post('/user/add/contact', contactData, {
          responseType: 'text'
        }).subscribe({
          next: () => resolve(null),
          error: (error) => reject(error)
        });
      });
    });

    return Promise.all(contactPromises);
  }

  private updateRoles(userId: number): Promise<any> {
    const originalRoles = this.originalProfile?.roles || [];
    const currentRoles = this.profile.roles || [];

    // Find new roles that need to be added
    const newRoles = currentRoles.filter(
      (role: string) => !originalRoles.includes(role)
    );

    if (newRoles.length === 0) return Promise.resolve();

    const rolePromises = newRoles.map((roleName: string) => {
      // Find the role ID
      const role = this.roles.find(r => r.name === roleName);
      if (!role) return Promise.resolve(); // Skip if role not found

      const roleData = {
        userId,
        roleId: role.id
      };

      return new Promise((resolve, reject) => {
        this.fetchService.post('/user/add/role', roleData, {
          responseType: 'text'
        }).subscribe({
          next: () => resolve(null),
          error: (error) => reject(error)
        });
      });
    });

    return Promise.all(rolePromises);
  }

  private updateInterests(userId: number): Promise<any> {
    const originalInterests = this.originalProfile?.interests || [];
    const currentInterests = this.profile.interests || [];

    // Find new interests that need to be added
    const newInterests = currentInterests.filter(
      (interest: string) => !originalInterests.includes(interest)
    );

    if (newInterests.length === 0) return Promise.resolve();

    const interestPromises = newInterests.map((interestName: string) => {
      // Find the category ID
      const category = this.categories.find(c => c.name === interestName);
      if (!category) return Promise.resolve(); // Skip if category not found

      const interestData = {
        userId,
        categoryId: category.id
      };

      return new Promise((resolve, reject) => {
        this.fetchService.post('/user/add/interest', interestData, {
          responseType: 'text'
        }).subscribe({
          next: () => resolve(null),
          error: (error) => reject(error)
        });
      });
    });

    return Promise.all(interestPromises);
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