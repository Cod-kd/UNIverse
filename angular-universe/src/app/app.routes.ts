import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { CenterContainerComponent } from './components/center-container/center-container.component';
import { LoginComponent } from './components/login/login.component';
import { UNIcardLoginComponent } from './components/unicard-login/unicard-login.component';
import { MainSiteComponent } from './components/main-site/main-site.component';
import { UNIcardComponent } from './components/unicard/unicard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GroupsComponent } from './components/groups/groups.component';
import { EventsComponent } from './components/events/events.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { authGuard } from './guards/auth.guard';
import { rootGuard } from './guards/root.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';

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
        canActivate: [authGuard],
        children: [
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'groups',
                component: GroupsComponent
            },
            {
                path: 'events',
                component: EventsComponent
            },
            {
                path: 'calendar',
                component: CalendarComponent
            }
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent,
        pathMatch: 'full',
    }

];