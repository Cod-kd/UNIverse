import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UniversityService } from '../../services/university.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { ButtonComponent } from "../button/button.component";
import { Router } from '@angular/router';
import { ToggleInputComponent } from "../toggle-input/toggle-input.component";
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  private http = inject(HttpClient);

  constructor(private router: Router) { }

  showCard = false;
  userExists = false;

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

    this.fetchRegister();
  }

  private fetchRegister() {
    const username = "admin";
    const password = "oneOfMyBestPasswords";

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa(username + ':' + password),
      'Content-Type': 'application/json'
    });

    const email = this.registrationForm.value.email || '';
    const nameIn = email.split('@')[0];

    const body = {
      emailIn: this.registrationForm.value.email,
      usernameIn: this.registrationForm.value.username,
      passwordIn: this.registrationForm.value.password,
      nameIn: nameIn,
      genderIn: this.registrationForm.value.gender === '1' ? true : false,
      birthDateIn: this.registrationForm.value.birthDate,
      facultyIn: this.registrationForm.value.faculty,
      universityNameIn: this.registrationForm.value.university,
      profilePictureExtensionIn: "jpg"
    };

    this.http.post('http://localhost:8080/user/registration', body, {
      headers,
      responseType: 'text'
    })
      .subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.showCard = true;
          this.router.navigate(['/get-unicard'], {
            state: { userData: this.registrationForm.value }
          });
        },
        error: (err) => {
          if (err.status === 409) {
            console.error("Foglalt felhasználónév vagy email!");
          } else {
            console.error("Szerveroldali hiba", err);
          }
        }
      });
  }

  returnToLogin() {
    this.router.navigate(["/login"]);
  }
}
