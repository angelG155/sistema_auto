import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../pages/auth/service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isAuthenticated = authService.initAuth();

  // Si está intentando acceder al login
  if (state.url === '/login') {
    if (isAuthenticated) {
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }

  // Para cualquier otra ruta protegida
  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
