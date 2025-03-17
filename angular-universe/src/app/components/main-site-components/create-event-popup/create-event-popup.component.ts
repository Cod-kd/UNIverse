import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../general-components/button/button.component';
import { ValidationService } from '../../../services/validation/validation.service';

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

  constructor(
    private fb: FormBuilder, 
    private validationService: ValidationService) { }

  ngOnInit(): void {
    this.eventForm = this.fb.group({
      name: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      place: ['', Validators.required],
      attachmentRelPath: ['esemeny.jpg'],
      description: ['', Validators.required]
    }, { validators: this.validationService.dateRangeValidator });
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