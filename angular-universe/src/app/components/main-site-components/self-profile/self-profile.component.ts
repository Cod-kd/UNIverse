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

  // Display arrays for UI
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
    private constantsService: ConstantsService,
    private universityService: UniversityService
  ) { }

  private updateProfileDisplay(): void {
    // Get full university name from code
    this.universityName = this.universityService.getUniversityName(
      this.profile.usersData.universityName
    );

    // Check if faculty is in code format and needs expansion
    if (this.profile.faculty) {
      // Try to get full faculty name if it's an abbreviation
      this.facultyName = this.universityService.getFacultyNameByAbbreviation(
        this.profile.usersData.universityName,
        this.profile.faculty
      );
    } else {
      this.facultyName = '';
    }
  }

  ngOnInit(): void {
    // Load constants data first
    this.loadConstants();

    // Then fetch user data
    const username = localStorage.getItem('username');
    if (username) {
      this.searchService.search(username).subscribe();
    }

    // Subscribe to search results
    this.subscriptions.push(
      this.searchService.searchResults$.subscribe((result: SearchResult) => {
        if (result && 'usersData' in result) {
          // Ensure arrays exist
          if (!result.contacts) result.contacts = [];
          if (!result.roles) result.roles = [];
          if (!result.interests) result.interests = [];

          this.profile = result;
          this.originalProfile = JSON.parse(JSON.stringify(this.profile));
          this.originalDescription = this.currentDescription;
          this.userBirthDate = this.profile.usersData.birthDate.replaceAll('-', '.');

          // Process arrays for display
          this.updateDisplayArrays();

          // Move this call here to ensure profile is loaded first
          this.updateProfileDisplay();
        }
      })
    );
  }

  private loadConstants(): void {
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
  }

  private updateDisplayArrays(): void {
    // Convert contact objects to display strings
    this.displayContacts = this.profile.contacts.map((contact: any) => {
      if (typeof contact === 'string') return contact; // Handle already formatted contacts

      const contactType = this.contactTypes.find(ct => ct.id === contact.contactTypeId);
      return contactType ? `${contactType.name}: ${contact.path}` : `${contact.contactTypeId}: ${contact.path}`;
    });

    // Convert role objects to display strings
    this.displayRoles = this.profile.roles.map((role: any) => {
      if (typeof role === 'string') return role; // Handle already formatted roles

      const roleObj = this.roles.find(r => r.id === role.roleId);
      return roleObj ? roleObj.name : `${role.roleId}`;
    });

    // Convert interest objects to display strings
    this.displayInterests = this.profile.interests.map((interest: any) => {
      if (typeof interest === 'string') return interest; // Handle already formatted interests

      const category = this.categories.find(c => c.id === interest.categoryId);
      return category ? category.name : `${interest.categoryId}`;
    });
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

    // Don't add duplicate contacts
    if (!this.displayContacts.includes(formattedContact)) {
      // Update the display array
      this.displayContacts.push(formattedContact);

      // Also add to the profile.contacts for saving later
      const contactType = this.contactTypes.find(ct => ct.name === this.contactInput.type);
      if (contactType) {
        // Add in object format for backend
        this.profile.contacts.push({
          userId: this.profile.userId,
          contactTypeId: contactType.id,
          path: this.contactInput.value
        });
      } else {
        // Fallback for non-standard types
        this.profile.contacts.push(formattedContact);
      }

      this.contactInput = { type: '', value: '' };
      this.contactPlaceholder = '';
    } else {
      this.popupService.showError('Ez az elérhetőség már létezik.');
    }
  }

  removeContact(contact: string): void {
    // Remove from display array
    this.displayContacts = this.displayContacts.filter(c => c !== contact);

    // Remove from profile data
    const [typeName, path] = contact.split(': ');
    const contactType = this.contactTypes.find(ct => ct.name === typeName);

    if (contactType) {
      this.profile.contacts = this.profile.contacts.filter((c: any) => {
        // Handle string or object format
        if (typeof c === 'string') return c !== contact;
        return !(c.contactTypeId === contactType.id && c.path === path);
      });
    } else {
      // Fallback for string format
      this.profile.contacts = this.profile.contacts.filter((c: any) => {
        if (typeof c === 'string') return c !== contact;
        return true;
      });
    }
  }

  addRole(): void {
    if (!this.newRole) return;

    // Don't add duplicate roles
    if (!this.displayRoles.includes(this.newRole)) {
      // Update display array
      this.displayRoles.push(this.newRole);

      // Add to profile for saving
      const role = this.roles.find(r => r.name === this.newRole);
      if (role) {
        this.profile.roles.push({
          userId: this.profile.userId,
          roleId: role.id
        });
      } else {
        // Fallback for string format
        this.profile.roles.push(this.newRole);
      }

      this.newRole = '';
    }
  }

  removeRole(role: string): void {
    // Remove from display array
    this.displayRoles = this.displayRoles.filter(r => r !== role);

    // Remove from profile data
    const roleObj = this.roles.find(r => r.name === role);

    if (roleObj) {
      this.profile.roles = this.profile.roles.filter((r: any) => {
        // Handle string or object format
        if (typeof r === 'string') return r !== role;
        return r.roleId !== roleObj.id;
      });
    } else {
      // Fallback for string format
      this.profile.roles = this.profile.roles.filter((r: any) => {
        if (typeof r === 'string') return r !== role;
        return true;
      });
    }
  }

  addInterest(): void {
    if (!this.newInterest) return;

    // Don't add duplicate interests
    if (!this.displayInterests.includes(this.newInterest)) {
      // Update display array
      this.displayInterests.push(this.newInterest);

      // Add to profile for saving
      const category = this.categories.find(c => c.name === this.newInterest);
      if (category) {
        this.profile.interests.push({
          userId: this.profile.userId,
          categoryId: category.id
        });
      } else {
        // Fallback for string format
        this.profile.interests.push(this.newInterest);
      }

      this.newInterest = '';
    }
  }

  removeInterest(interest: string): void {
    // Remove from display array
    this.displayInterests = this.displayInterests.filter(i => i !== interest);

    // Remove from profile data
    const category = this.categories.find(c => c.name === interest);

    if (category) {
      this.profile.interests = this.profile.interests.filter((i: any) => {
        // Handle string or object format
        if (typeof i === 'string') return i !== interest;
        return i.categoryId !== category.id;
      });
    } else {
      // Fallback for string format
      this.profile.interests = this.profile.interests.filter((i: any) => {
        if (typeof i === 'string') return i !== interest;
        return true;
      });
    }
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
    const originalContactLabels = this.displayContacts || [];
    const currentContactLabels = this.displayContacts || [];

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
    const originalRoles = this.displayRoles || [];
    const currentRoles = this.displayRoles || [];

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
    const originalInterests = this.displayInterests || [];
    const currentInterests = this.displayInterests || [];

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