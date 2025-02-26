import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group } from '../../../models/group/group.model';
import { ButtonComponent } from '../../general-components/button/button.component';

@Component({
  selector: 'app-single-group',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './single-group.component.html',
  styleUrl: './single-group.component.css'
})
export class SingleGroupComponent {
  @Input() group!: Group;

  joinGroup(){
    alert("Joined group!");
  }
}