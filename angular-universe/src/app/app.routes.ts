import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { CenterContainerComponent } from './components/center-container/center-container.component';
import { LoginComponent } from './components/login/login.component';
import { UNIcardLoginComponent } from './components/unicard-login/unicard-login.component';
import { MainSiteComponent } from './components/main-site/main-site.component';

export const routes: Routes = [
    { path: '', component: CenterContainerComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'login', component: LoginComponent },
    { path: 'UNIcard-login', component: UNIcardLoginComponent },
    { path: 'main-site', component: MainSiteComponent }
];
