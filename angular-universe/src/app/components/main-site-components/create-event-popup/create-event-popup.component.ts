import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
      attachmentRelPath: ['esemeny.jpg'],
      description: ['', Validators.required]
    }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('startDate')?.value;
    const endDate = control.get('endDate')?.value;

    if (!startDate || !endDate) {
      return null;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    return end <= start ? { endDateBeforeStartDate: true } : null;
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
      const formData = this.eventForm.value;

      if (formData.startDate) {
        formData.startDate = new Date(formData.startDate).toISOString();
      }

      if (formData.endDate) {
        formData.endDate = new Date(formData.endDate).toISOString();
      }

      this.submit.emit(formData);
    } else {
      Object.keys(this.eventForm.controls).forEach(key => {
        this.eventForm.get(key)?.markAsTouched();
      });
    }
  }
}