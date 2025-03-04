import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversityService } from '../../../services/university/university.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from "../../general-components/button/button.component";
import { Router } from '@angular/router';
import { ToggleInputComponent } from '../toggle-input/toggle-input.component';
import { RegisterService } from '../../../services/register/register.service';
import { debounceTime } from 'rxjs/operators';
import { ValidationService } from '../../../services/validation/validation.service';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, ToggleInputComponent],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit, OnDestroy {
  @ViewChild(ToggleInputComponent) passwordInput!: ToggleInputComponent;

  private fb = inject(FormBuilder);
  private universityService = inject(UniversityService);
  private registerService = inject(RegisterService);
  private formStorageKey = 'registrationFormData';

  constructor(private router: Router, private validationService: ValidationService) { }

  showCard = false;

  universities = toSignal(this.universityService.getUniversities());
  faculties = toSignal(this.universityService.faculties$);

  registrationForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', Validators.required],
    fullName: ['', Validators.required],
    gender: ['', Validators.required],
    password: ['', Validators.required],
    birthDate: ['', Validators.required],
    university: ['', Validators.required],
    faculty: ['', Validators.required]
  });

  ngOnInit() {
    this.onUniversityChange();
    this.restoreFormData();

    this.registrationForm.valueChanges
      .pipe(
        debounceTime(500)
      )
      .subscribe(() => this.saveFormData());
  }

  ngOnDestroy() {
    this.saveFormData();
  }

  onEmailChange() {
    const email = this.registrationForm.get('email')?.value;
    if (typeof email === 'string') {
      this.validationService.validateEmail(email);
    }
  }

  onUsernameChange() {
    const username = this.registrationForm.get('username')?.value;
    if (typeof username === 'string') {
      this.validationService.validateUsername(username);
    }
  }

  onFullNameChange(){
    const fullName = this.registrationForm.get('fullName')?.value;
    if(typeof fullName === 'string'){
      this.validationService.validateFullName(fullName);
    }
  }

  onBirthDateChange() {
    const birthDate = this.registrationForm.get('birthDate')?.value;
    if (typeof birthDate === 'string') {
      this.validationService.validateBirthDate(birthDate);
    }
  }

  private saveFormData() {
    const { university, faculty, ...formData } = this.registrationForm.value;
    localStorage.setItem(this.formStorageKey, JSON.stringify(formData));
  }

  private restoreFormData() {
    const savedData = localStorage.getItem(this.formStorageKey);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.registrationForm.patchValue(parsedData, { emitEvent: false });
    }
  }

  private clearSavedFormData() {
    localStorage.removeItem(this.formStorageKey);
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

  onFacultyChange() {
    const registrationDiv = document.querySelector("form");
    if (registrationDiv) {
      registrationDiv.scrollTo(0, registrationDiv.scrollHeight)
    }
  }

  registerNewUser() {
    this.registrationForm.patchValue({
      password: this.passwordInput.passwordControl.value
    });

    const email = this.registrationForm.get('email')?.value ?? '';
    const username = this.registrationForm.get('username')?.value ?? '';
    const fullName = this.registrationForm.get('fullName')?.value ?? '';
    const password = this.registrationForm.get('password')?.value ?? '';
    const gender = this.registrationForm.get('gender')?.value ?? '';
    const birthDate = this.registrationForm.get('birthDate')?.value ?? '';
    const university = this.registrationForm.get('university')?.value ?? '';
    const faculty = this.registrationForm.get('faculty')?.value ?? '';

    this.validationService.validateEmail(email);
    this.validationService.validateUsername(username);
    this.validationService.validateFullName(fullName);
    this.validationService.validateBirthDate(birthDate);
    this.validationService.validatePassword(password);
    this.validationService.validateUniversity(university);
    this.validationService.validateFaculty(faculty);

    this.registerService.fetchRegister(email, username, fullName, password, gender, birthDate, university, faculty)
      .subscribe({
        next: () => {
          this.clearSavedFormData();
          this.registerService.handleRegisterResponse(this.registrationForm.value);
        },
        error: (err) => {
          this.registerService.handleError(err);
        },
      });
  }

  returnToLogin() {
    this.router.navigate(["/login"]);
  }
}
