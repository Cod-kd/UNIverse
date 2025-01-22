import { Component, inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from "../button/button.component";
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleInputComponent } from '../toggle-input/toggle-input.component';

@Component({
 selector: 'app-login',
 standalone: true,
 imports: [ButtonComponent, ReactiveFormsModule, ToggleInputComponent],
 templateUrl: './login.component.html',
 styleUrl: './login.component.css'
})
export class LoginComponent {
 @ViewChild(ToggleInputComponent) passwordInput!: ToggleInputComponent;
 private fb = inject(FormBuilder);

 loginForm = this.fb.group({
   username: ['', Validators.required],
   password: ['', Validators.required]
 });

 constructor(private router: Router) {}

 loginWithCredentials() {
   this.loginForm.patchValue({
     password: this.passwordInput.passwordControl.value
   });

   // value access --> this.loginForm.value.password / username

   if(this.loginForm.valid) {
     this.router.navigate(["/main-site"], {
       state: { credentials: this.loginForm.value }
      });
      
   }
 }

 onUNIcardLoginClick = () => this.router.navigate(["/UNIcard-login"]);
 backToRegistration = () => this.router.navigate(["/registration"]);
}