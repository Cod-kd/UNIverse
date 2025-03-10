import { Injectable } from '@angular/core';
import { FetchService } from '../fetch/fetch.service';

@Injectable({
  providedIn: 'root'
})
export class ConstantsService {

  constructor(private fetchService: FetchService) { }

  getRoles(): void {
    this.fetchService.get('/user/common/roles').subscribe(
      (data) => {
        console.log('Roles:', data);
      },
      (error) => {
        console.error('Error fetching roles:', error);
      }
    );
  }

  getContacts(): void {
    this.fetchService.get('/user/common/contacttypes').subscribe(
      (data) => {
        console.log('Contacts:', data);
      },
      (error) => {
        console.error('Error fetching contacts:', error);
      }
    );
  }

  getCategories(): void{
    this.fetchService.get('/user/common/categories').subscribe(
      (data)=>{
        console.log('Categories:', data);
      },
      (error) => {
        console.error("Error fetching categories:", error);
      }
    )
  }
}
