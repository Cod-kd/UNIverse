import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { catchError, of } from 'rxjs';
import { FetchService } from '../../services/fetch/fetch.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const fetchService = inject(FetchService);
  const router = inject(Router);


   
  
};