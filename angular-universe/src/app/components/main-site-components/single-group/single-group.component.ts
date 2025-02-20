import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Group } from '../../../models/group/group.model';

@Component({
  selector: 'app-single-group',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-group.component.html',
  styleUrl: './single-group.component.css'
})
export class SingleGroupComponent {
  @Input() group!: Group;
}