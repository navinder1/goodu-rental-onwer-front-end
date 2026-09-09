import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';

// This is the OWNER frontend only — any logged-in user must have role OWNER.
// Tenants/Admins are sent back to the login page with a message.
export const ownerGuard: CanActivateFn = () => {

  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    router.navigate(['/auth']);
    return false;
  }

  if (role !== 'OWNER') {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    router.navigate(['/auth']);
    return false;
  }

  return true;
};
