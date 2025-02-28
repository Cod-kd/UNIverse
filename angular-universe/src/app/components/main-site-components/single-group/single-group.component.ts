import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() isExpanded: boolean = false;
  @Output() toggleRequest = new EventEmitter<number>();

  toggleExpand(event: Event) {
    event.stopPropagation();
    this.toggleRequest.emit(this.group.id);
  }

  joinGroup(event: Event) {
    event.stopPropagation();
    alert("Joined group!");
  }
}