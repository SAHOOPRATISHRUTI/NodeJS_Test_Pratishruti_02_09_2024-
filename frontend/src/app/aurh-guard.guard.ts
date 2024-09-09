import { CanActivateFn, Router } from '@angular/router';
import { ServiceService } from './services/service.service';
import { inject } from '@angular/core';

export const aurhGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(ServiceService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['ntspl']);
    return false;
  }

};
