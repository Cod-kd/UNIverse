import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService, SearchResult } from '../../../services/search/search.service';

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
  
  // Edit states
  editingDescription = false;
  tempDescription = '';
  
  // New item fields
  newContact = '';
  newRole = '';
  newInterest = '';
  
  // Available options
  contactOptions = ['Email', 'Phone', 'Website', 'LinkedIn', 'GitHub', 'Twitter'];
  roleOptions = ['role-1', 'role-2', 'role-3'];
  interestOptions = ['IT', 'Electronics', 'Cats', 'Music', 'Sports', 'Art', 'Reading'];
  
  constructor(private searchService: SearchService) {}
  
  ngOnInit(): void {
    // Subscribe to search service for profile data
    this.searchService.searchResults$.subscribe((result: SearchResult) => {
      if (result && 'usersData' in result) {
        // Initialize empty arrays if they don't exist
        result.contacts = result.contacts || [];
        result.roles = result.roles || [];
        result.interests = result.interests || [];
        
        this.profile = result;
        // Create deep copy for reset functionality
        this.originalProfile = JSON.parse(JSON.stringify(this.profile));
      }
    });
  }
  
  // Description editing
  editDescription(): void {
    this.editingDescription = true;
    this.tempDescription = this.profile.description || '';
  }
  
  saveDescription(): void {
    this.profile.description = this.tempDescription;
    this.editingDescription = false;
  }
  
  // Contact management
  addContact(): void {
    if (this.newContact && !this.profile.contacts.includes(this.newContact)) {
      this.profile.contacts.push(this.newContact);
      this.newContact = '';
    }
  }
  
  removeContact(contact: string): void {
    this.profile.contacts = this.profile.contacts.filter((c: string) => c !== contact);
  }
  
  // Role management
  addRole(): void {
    if (this.newRole && !this.profile.roles.includes(this.newRole)) {
      this.profile.roles.push(this.newRole);
      this.newRole = '';
    }
  }
  
  removeRole(role: string): void {
    this.profile.roles = this.profile.roles.filter((r: string) => r !== role);
  }
  
  // Interest management
  addInterest(): void {
    if (this.newInterest && !this.profile.interests.includes(this.newInterest)) {
      this.profile.interests.push(this.newInterest);
      this.newInterest = '';
    }
  }
  
  removeInterest(interest: string): void {
    this.profile.interests = this.profile.interests.filter((i: string) => i !== interest);
  }
  
  // Form actions
  saveChanges(): void {
    // Here would go API call to save profile changes
    console.log('Saving profile:', this.profile);
    this.originalProfile = JSON.parse(JSON.stringify(this.profile));
  }
  
  cancel(): void {
    // Reset to original values
    this.profile = JSON.parse(JSON.stringify(this.originalProfile));
  }
}