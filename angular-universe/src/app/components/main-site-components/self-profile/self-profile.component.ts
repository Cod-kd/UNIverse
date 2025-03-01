import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../../services/search/search.service';
import { interests } from '../../../constants/interest';
import { roles } from '../../../constants/roles';
import { contacts } from '../../../constants/contacts';

@Component({
  selector: 'app-self-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './self-profile.component.html',
  styleUrl: './self-profile.component.css'
})
export class SelfProfileComponent implements OnInit {
  profile: any = null;
  originalProfile: any = null;

  editingDescription = false;
  tempDescription = '';

  newContact = '';
  newRole = '';
  newInterest = '';

  contactOptions = contacts;
  roleOptions = roles;
  interestOptions = interests;

  constructor(private searchService: SearchService) { }

  ngOnInit(): void {
    this.searchService.searchResults$.subscribe((result: SearchResult) => {
      if (result && 'usersData' in result) {
        result.contacts = result.contacts || [];
        result.roles = result.roles || [];
        result.interests = result.interests || [];

        this.profile = result;
        this.originalProfile = JSON.parse(JSON.stringify(this.profile));
      }
    });

    const username = localStorage.getItem('username');
    if (username) {
      this.searchService.search(username).subscribe();
    }
  }

  editDescription(): void {
    this.editingDescription = true;
    this.tempDescription = this.profile.description || '';
  }

  saveDescription(): void {
    this.profile.description = this.tempDescription;
    this.editingDescription = false;
  }

  addContact(): void {
    if (this.newContact && !this.profile.contacts.includes(this.newContact)) {
      this.profile.contacts.push(this.newContact);
      this.newContact = '';
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
    console.log('Saving profile:', this.profile);
    this.originalProfile = JSON.parse(JSON.stringify(this.profile));
  }

  cancel(): void {
    this.profile = JSON.parse(JSON.stringify(this.originalProfile));
  }
}