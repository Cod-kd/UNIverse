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
import { authGuard } from './guards/auth.guard';
import { rootGuard } from './guards/root.guard';

export const routes: Routes = [
    {
        path: '',
        component: CenterContainerComponent,
        canActivate: [rootGuard]
    },
    {
        path: 'registration',
        component: RegistrationComponent,
        canActivate: [rootGuard]
    },
    {
        path: 'get-unicard',
        component: UNIcardComponent,
        canActivate: [rootGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [rootGuard]
    },
    {
        path: 'UNIcard-login',
        component: UNIcardLoginComponent,
        canActivate: [rootGuard]
    },
    {
        path: 'main-site',
        component: MainSiteComponent,
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [authGuard]
    },
    {
        path: 'groups',
        component: GroupComponent,
        canActivate: [authGuard]
    },
    {
        path: 'events',
        component: EventComponent,
        canActivate: [authGuard]
    },
    {
        path: 'calendar',
        component: CalendarComponent,
        canActivate: [authGuard]
    }
];