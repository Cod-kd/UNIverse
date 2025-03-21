import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonComponent } from '../../general-components/button/button.component';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [FormsModule, ButtonComponent],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css'
})
export class CreatePostComponent {
  @Input() groupName: string = '';
  @Output() cancelEvent = new EventEmitter<void>();
  @Output() submitEvent = new EventEmitter<{ content: string, file?: File }>();

  postContent: string = '';
  selectedFile?: File;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  cancel() {
    this.cancelEvent.emit();
  }

  submit() {
    if (this.postContent.trim()) {
      this.submitEvent.emit({
        content: this.postContent,
        file: this.selectedFile
      });
      this.postContent = '';
      this.selectedFile = undefined;
    }
  }
}