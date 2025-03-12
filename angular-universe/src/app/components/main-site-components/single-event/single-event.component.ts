import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Event } from '../../../models/event/event.model';
import { ButtonComponent } from '../../general-components/button/button.component';

@Component({
  selector: 'app-single-event',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './single-event.component.html',
  styleUrl: './single-event.component.css'
})
export class SingleEventComponent {
  @Input() event!: Event;

  addInterest() {
    alert("Interest added!");
  }

  addParticipation() {
    alert("Participation added!");
  }
}