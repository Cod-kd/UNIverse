import { Component, inject } from '@angular/core';
import { ButtonComponent } from '../../general-components/button/button.component';
import { Router } from '@angular/router';
import { CardMetadataService } from '../../../services/card-meta-data/card-meta-data.service';
import { PopupService } from '../../../services/popup-message/popup-message.service';

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

  constructor(private router: Router, private popupService: PopupService) { }

  saveUniCard = async () => {
    const userDataDiv = document.getElementById('userDataDiv');
    if (!userDataDiv) {
      this.popupService.show('UNIcard not found.');
      return;
    }

    try {
      await this.cardMetadataService.saveCardData(this.userData, userDataDiv);
      this.router.navigate(['/UNIcard-login']);
    } catch (error) {
      this.popupService.show(`UNIcard save failed: ${error}`);
    }
  };
}

