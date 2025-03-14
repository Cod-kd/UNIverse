import { APP_INITIALIZER, ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { ThemeService } from './services/theme/theme.service';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import localeHu from '@angular/common/locales/hu';

registerLocaleData(localeHu);

export function initializeTheme(themeService: ThemeService) {
  return () => {
    return themeService.loadTheme();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'hu' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTheme,
      deps: [ThemeService],
      multi: true
    }
  ]
};