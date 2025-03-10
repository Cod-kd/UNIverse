import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../../services/search/search.service';
import { interests } from '../../../constants/interest';
import { roles } from '../../../constants/roles';
import { ButtonComponent } from "../../general-components/button/button.component";
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { FetchService } from '../../../services/fetch/fetch.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ConstantsService } from '../../../services/constants/constants.service';

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
export class SelfProfileComponent implements OnInit {
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

  contactOptions = ['Email', 'Link', 'Phone Number'];
  roleOptions = roles;
  interestOptions = interests;

  emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  linkPattern = /^(https:\/\/|www\.)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\/[a-zA-Z0-9-_.~:/?#[\]@!$&'()*+,;=]*)?$/;
  phonePattern = /^\+?[0-9]{10,15}$/;

  constructor(
    private searchService: SearchService,
    private popupService: PopupService,
    private fetchService: FetchService,
    private authService: AuthService,
    private router: Router,
    private constantsService: ConstantsService
  ) { }

  ngOnInit(): void {
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
      this.constantsService.getRoles();
      this.constantsService.getContacts();
      this.constantsService.getCategories();
      // Fix error: 3 requests are launched
    });

    const username = localStorage.getItem('username');
    if (username) {
      this.searchService.search(username).subscribe();
    }
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
    switch (this.contactInput.type) {
      case 'Email': return 'example@domain.com';
      case 'Link': return 'https://example.com';
      case 'Phone Number': return '+36201234567';
      default: return '';
    }
  }

  validateContact(): boolean {
    if (!this.contactInput.value) {
      this.popupService.showError('Kérjük, add meg az elérhetőség értékét!');
      return false;
    }

    switch (this.contactInput.type) {
      case 'Email':
        if (!this.emailPattern.test(this.contactInput.value)) {
          this.popupService.showError('Hibás e-mail formátum!');
          return false;
        }
        break;
      case 'Link':
        if (!this.linkPattern.test(this.contactInput.value)) {
          this.popupService.showError('Hibás link formátum!');
          return false;
        }
        break;
      case 'Phone Number':
        if (!this.phonePattern.test(this.contactInput.value)) {
          this.popupService.showError('Hibás telefonszám formátum!');
          return false;
        }
        break;
      default:
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
    if (JSON.stringify(this.profile.description) === JSON.stringify(this.originalProfile?.description) &&
      JSON.stringify(this.profile.contacts) === JSON.stringify(this.originalProfile?.contacts) &&
      JSON.stringify(this.profile.roles) === JSON.stringify(this.originalProfile?.roles) &&
      JSON.stringify(this.profile.interests) === JSON.stringify(this.originalProfile?.interests)) {
      this.popupService.showError("Nincs új menthető adat!");
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.isSaving = true;

    const requestBody = {
      description: this.profile.description,
      userId: parseInt(userId)
    };

    this.fetchService.post('/user/update/desc', requestBody, {
      responseType: 'text'
    }).subscribe({
      next: () => {
        this.originalProfile = JSON.parse(JSON.stringify(this.profile));
        this.isSaving = false;
        this.popupService.showSuccess("Sikeres módosítás!");
      },
      error: () => {
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