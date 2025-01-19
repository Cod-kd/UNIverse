import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversityService } from '../../services/university.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from "../button/button.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent {
  constructor(private router: Router) { }
  private fb = inject(FormBuilder);
  private universityService = inject(UniversityService);

  universities = toSignal(this.universityService.getUniversities());
  faculties = toSignal(this.universityService.faculties$);

  registrationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    gender: ['', Validators.required],
    password: ['', Validators.required],
    birthDate: ['', Validators.required],
    university: ['', Validators.required],
    faculty: [{ value: '', disabled: true }, Validators.required]
  });

  onUniversityChange() {
    const universityId = this.registrationForm.get('university')?.value;
    if (universityId) {
      this.registrationForm.get('faculty')?.enable();
      this.universityService.loadFaculties(universityId);
    } else {
      this.registrationForm.get('faculty')?.disable();
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      console.log(this.registrationForm.value);
    }
  }

  registerNewUser() {
    alert("Successful registration!");
  }

  returnToLogin() {
    this.router.navigate(["/login"]);
  }
}
