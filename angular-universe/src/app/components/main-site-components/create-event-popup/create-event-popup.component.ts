import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../general-components/button/button.component';

@Component({
  selector: 'app-create-event-popup',
  standalone: true,
  imports: [ButtonComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './create-event-popup.component.html',
  styleUrl: './create-event-popup.component.css'
})
export class CreateEventPopupComponent implements OnInit {
  @Input() groupName!: string;
  @Output() cancel = new EventEmitter<void>();
  @Output() submit = new EventEmitter<any>();

  eventForm!: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    const userId = this.getUserIdFromLocalStorage();

    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      creatorId: [userId, Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      place: ['', Validators.required],
      attachmentRelPath: ['esemeny.jpg'], // Default value
      description: ['', Validators.required]
    });
  }

  private getUserIdFromLocalStorage(): number {
    const userIdStr = localStorage.getItem('userId');
    return userIdStr ? parseInt(userIdStr, 10) : 0;
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      // Format dates to ISO string
      const formData = this.eventForm.value;

      // Ensure dates are properly formatted
      if (formData.startDate) {
        formData.startDate = new Date(formData.startDate).toISOString();
      }

      if (formData.endDate) {
        formData.endDate = new Date(formData.endDate).toISOString();
      }

      this.submit.emit(formData);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.eventForm.controls).forEach(key => {
        this.eventForm.get(key)?.markAsTouched();
      });
    }
  }
}
