import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversityService } from '../../services/university.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from "../button/button.component";
import { Router } from '@angular/router';
import { ToggleInputComponent } from "../toggle-input/toggle-input.component";
import { RegisterService } from '../../services/register.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, ToggleInputComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  @ViewChild(ToggleInputComponent) passwordInput!: ToggleInputComponent;

  private fb = inject(FormBuilder);
  private universityService = inject(UniversityService);
  private registerService = inject(RegisterService);

  constructor(private router: Router) { }

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
    faculty: ['']
  });

  ngOnInit() {
    this.onUniversityChange();
  }

  formatBirthDate(event: any) {
    const input = event.target;
    const value = input.value.replace(/\D/g, '');

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

    this.registrationForm.get('faculty')?.setValue('');

    if (universityId) {
      this.registrationForm.get('faculty')?.enable();
      this.universityService.loadFaculties(universityId);
    } else {
      this.registrationForm.get('faculty')?.disable();
    }
  }

  registerNewUser() {
    this.registrationForm.patchValue({
      password: this.passwordInput.passwordControl.value
    });

    const { email, username, password, gender, birthDate, university, faculty } = this.registrationForm.value;

    if (email && username && password && gender && birthDate && university && faculty) {
      this.registerService.fetchRegister(email, username, password, gender, birthDate, university, faculty).subscribe({
        next: (response) => {
          this.registerService.handleRegisterResponse(response, this.registrationForm.value);
        },
        error: (err) => {
          this.registerService.handleError(err);
        }
      });
    }
  }

  returnToLogin() {
    this.router.navigate(["/login"]);
  }
}
