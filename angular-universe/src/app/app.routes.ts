import { Routes } from '@angular/router';
import { RegistrationComponent } from './components/root-page-components/registration/registration.component';
import { CenterContainerComponent } from './components/root-page-components/center-container/center-container.component';
import { LoginComponent } from './components/root-page-components/login/login.component';
import { UNIcardLoginComponent } from './components/root-page-components/unicard-login/unicard-login.component';
import { MainSiteComponent } from './components/main-site-components/main-site/main-site.component';
import { UNIcardComponent } from './components/root-page-components/unicard/unicard.component';
import { GroupsComponent } from './components/main-site-components/groups/groups.component';
import { EventsComponent } from './components/main-site-components/events/events.component';
import { authGuard } from './guards/auth/auth.guard';
import { rootGuard } from './guards/root/root.guard';
import { PageNotFoundComponent } from './components/main-site-components/page-not-found/page-not-found.component';
import { SelfProfileComponent } from './components/main-site-components/self-profile/self-profile.component';
import { UserProfileComponent } from './components/main-site-components/user-profile/user-profile.component';
import { SettingsComponent } from './components/main-site-components/settings/settings.component';
import { OpenedGroupComponent } from './components/main-site-components/opened-group/opened-group.component';

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
                path: 'user-profile',
                component: UserProfileComponent
            },
            {
                path: 'groups',
                component: GroupsComponent
            },
            {
                path: 'groups/:id',
                component: OpenedGroupComponent
            },
            {
                path: 'events',
                component: EventsComponent
            },
            {
                path: 'you',
                component: SelfProfileComponent
            },
            {
                path: 'settings',
                component: SettingsComponent
            },
        ]
    },
    {
        path: '**',
        component: PageNotFoundComponent
    }
];