import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { CenterContainerComponent } from './components/center-container/center-container.component';
import { LoginComponent } from './components/login/login.component';
import { UNIcardLoginComponent } from './unicard-login/unicard-login.component';

export const routes: Routes = [
    { path: '', component: CenterContainerComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'UNIcard-login', component: UNIcardLoginComponent }
];
