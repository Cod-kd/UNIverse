import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { CenterContainerComponent } from './components/center-container/center-container.component';
import { LoginComponent } from './components/login/login.component';
import { UNIcardLoginComponent } from './components/unicard-login/unicard-login.component';
import { MainSiteComponent } from './components/main-site/main-site.component';
import { UNIcardComponent } from './components/unicard/unicard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GroupComponent } from './components/group/group.component';
import { EventComponent } from './components/event/event.component';
import { CalendarComponent } from './components/calendar/calendar.component';

export const routes: Routes = [
    { path: '', component: CenterContainerComponent },
    { path: 'registration', component: RegistrationComponent },
    { path: 'get-unicard', component: UNIcardComponent },
    { path: 'login', component: LoginComponent },
    { path: 'UNIcard-login', component: UNIcardLoginComponent },
    { path: 'main-site', component: MainSiteComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'groups', component: GroupComponent },
    { path: 'events', component: EventComponent },
    { path: 'calendar', component: CalendarComponent }
];
