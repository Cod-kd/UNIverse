import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { Router } from '@angular/router';
import { CardMetadataService } from '../../services/card-meta-data.service';

interface UserData {
  email: string;
  username: string;
  gender: string;
  birthDate: string;
  university: string;
  faculty: string;
  password: string;
}

@Component({
  selector: 'app-unicard',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './unicard.component.html',
  styleUrls: ['./unicard.component.css'],
})
export class UNIcardComponent {
  userData: UserData = history.state.userData;
  private cardMetadataService = inject(CardMetadataService);

  constructor(private router: Router) {}

  saveUniCard = async () => {
    const userDataDiv = document.getElementById('userDataDiv');
    if (!userDataDiv) {
      console.error('User data div not found.');
      return;
    }

    try {
      await this.cardMetadataService.saveCardData(this.userData, userDataDiv);
      this.router.navigate(['/UNIcard-login']);
    } catch (error) {
      console.error(`UNIcard save failed: ${error}`);
    }
  };
}
