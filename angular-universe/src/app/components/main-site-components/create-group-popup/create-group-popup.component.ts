import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../general-components/button/button.component';
import { GroupService } from '../../../services/group/group.service';

@Component({
  selector: 'app-create-group-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './create-group-popup.component.html',
  styleUrl: './create-group-popup.component.css'
})
export class CreateGroupPopupComponent {
  @Output() closePopup = new EventEmitter<void>();

  groupForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private groupService: GroupService
  ) {
    this.groupForm = this.fb.group({
      groupName: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  onSubmit(): void {
    if (this.groupForm.invalid || this.loading) {
      return;
    }

    this.loading = true;
    const groupName = this.groupForm.get('groupName')?.value;

    this.groupService.createGroup(groupName).subscribe({
      next: () => {
        this.loading = false;
        this.close();
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  close(): void {
    this.closePopup.emit();
  }

  onOverlayClick(event: MouseEvent): void {
    // Close only if clicking directly on the overlay, not its children
    if ((event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.close();
    }
  }
}