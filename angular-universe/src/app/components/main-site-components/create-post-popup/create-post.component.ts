import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../general-components/button/button.component';

@Component({
  selector: 'app-create-post-popup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './create-post-popup.component.html',
  styleUrl: './create-post-popup.component.css'
})
export class CreatePostPopupComponent {
  @Input() groupName: string = '';
  @Output() cancelEvent = new EventEmitter<void>(); // Changed from cancel to cancelEvent
  @Output() submitEvent = new EventEmitter<{ content: string, file?: File }>(); // Changed from submit to submitEvent

  postForm: FormGroup;
  selectedFile?: File;

  constructor(private fb: FormBuilder) {
    this.postForm = this.fb.group({
      content: ['', Validators.required]
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  cancel(event?: MouseEvent): void { // Changed method name
    // Close when clicking the overlay directly
    if (!event || (event.target as HTMLElement).classList.contains('popup-overlay')) {
      this.cancelEvent.emit();
    }
  }

  submit(): void { // Changed method name
    if (this.postForm.valid) {
      this.submitEvent.emit({
        content: this.postForm.get('content')?.value,
        file: this.selectedFile
      });
      this.postForm.reset();
      this.selectedFile = undefined;
    } else {
      this.postForm.get('content')?.markAsTouched();
    }
  }
}