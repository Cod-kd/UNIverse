import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../../services/search/search.service';
import { interests } from '../../../constants/interest';
import { roles } from '../../../constants/roles';
import { ButtonComponent } from "../../general-components/button/button.component";
import { PopupService } from '../../../services/popup-message/popup-message.service';
import { FetchService } from '../../../services/fetch/fetch.service';

interface ContactInput {
  type: string;
  value: string;
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

  editingDescription = false;
  tempDescription = '';

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
    private fetchService: FetchService
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
      }
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
      this.popupService.show('Kérjük, add meg az elérhetőség értékét.');
      return false;
    }

    switch (this.contactInput.type) {
      case 'Email':
        if (!this.emailPattern.test(this.contactInput.value)) {
          this.popupService.show('Hibás e-mail formátum. Kérjük, add meg a helyes e-mail címet.');
          return false;
        }
        break;
      case 'Link':
        if (!this.linkPattern.test(this.contactInput.value)) {
          this.popupService.show('Hibás link formátum. A linknek https:// vagy www. kezdettel kell rendelkeznie.');
          return false;
        }
        break;
      case 'Phone Number':
        if (!this.phonePattern.test(this.contactInput.value)) {
          this.popupService.show('Hibás telefonszám formátum. Kérjük, használj 10-15 számjegyet.');
          return false;
        }
        break;
      default:
        this.popupService.show('Kérjük, válassz elérhetőség típust.');
        return false;
    }
    return true;
  }

  addContact(): void {
    if (!this.contactInput.type) {
      this.popupService.show('Kérjük, válassz elérhetőség típust.');
      return;
    }

    if (!this.validateContact()) return;

    const formattedContact = `${this.contactInput.type}: ${this.contactInput.value}`;

    if (!this.profile.contacts.includes(formattedContact)) {
      this.profile.contacts.push(formattedContact);
      this.contactInput = { type: '', value: '' };
      this.contactPlaceholder = '';
    } else {
      this.popupService.show('Ez az elérhetőség már létezik.');
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
    if (this.profile.description === this.originalProfile?.description) return;

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
        this.originalProfile.description = this.profile.description;
        this.isSaving = false;
        this.popupService.showSuccess("Sikeres módosítás!");
      },
      error: () => {
        this.isSaving = false;
      }
    });
  }
}