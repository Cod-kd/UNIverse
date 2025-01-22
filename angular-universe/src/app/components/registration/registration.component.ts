import { Component, inject, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversityService } from '../../services/university.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from "../button/button.component";
import { Router } from '@angular/router';
import { ToggleInputComponent } from "../toggle-input/toggle-input.component";

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, ToggleInputComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})

export class RegistrationComponent {
  @ViewChild(ToggleInputComponent) passwordInput!: ToggleInputComponent;
  constructor(private router: Router) { }
  private fb = inject(FormBuilder);
  private universityService = inject(UniversityService);
  showCard = false;

  universities = toSignal(this.universityService.getUniversities());
  faculties = toSignal(this.universityService.faculties$);

  registrationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    gender: ['', Validators.required],
    password: ['', Validators.required],
    birthDate: ['', Validators.required],
    university: ['', Validators.required],
    faculty: [{ value: '', disabled: true }]
  });

  formatBirthDate(event: any) {
    let input = event.target;
    let value = input.value.replace(/\D/g, '');

    if (value.length > 0) {
      let formattedDate = '';
      if (value.length > 4) {
        formattedDate += value.substr(0, 4) + '-';
        if (value.length > 6) {
          formattedDate += value.substr(4, 2) + '-';
          formattedDate += value.substr(6, 2);
        } else {
          formattedDate += value.substr(4);
        }
      } else {
        formattedDate = value;
      }
      this.registrationForm.patchValue({ birthDate: formattedDate }, { emitEvent: false });
    }
  }

  onUniversityChange() {
    const universityId = this.registrationForm.get('university')?.value;
    if (universityId) {
      this.registrationForm.get('faculty')?.enable();
      this.universityService.loadFaculties(universityId);
      universityId ? this.registrationForm.get('faculty')?.enable() : null;
    }
  }

  registerNewUser() {
    this.registrationForm.patchValue({
      password: this.passwordInput.passwordControl.value
    });

    if (this.registrationForm.valid) {
      this.showCard = true;
      // Only redirect here if username and email isnt already present in database (code != 200)
      this.router.navigate(['/get-unicard'], {
        state: { userData: this.registrationForm.value }
      });
    }
  }

  returnToLogin() {
    this.router.navigate(["/login"]);
  }
}
