import { Routes } from '@angular/router';
import { Auth } from './auth/auth';
import { Register } from './register/register';
import { Profile } from './profile/profile';
import { OwnerDashboard } from './owner-dashboard/owner-dashboard';
import { MyProperties } from './my-properties/my-properties';
import { PropertyRegister } from './property-register/property-register';
import { PropertyEdit } from './property-edit/property-edit';
import { PropertyMedia } from './property-media/property-media';
import { AvailabilityManager } from './availability-manager/availability-manager';
import { ReceivedVisits } from './received-visits/received-visits';
import { ReceivedContactRequests } from './received-contact-requests/received-contact-requests';
import { ReceivedApplications } from './received-applications/received-applications';
import { Notifications } from './notifications/notifications';
import { ownerGuard } from './owner.guard';

export const routes: Routes = [
  // Public
  { path: '', redirectTo: 'auth', pathMatch: 'full' },
  { path: 'auth', component: Auth },
  { path: 'register', component: Register },

  // Requires a logged-in OWNER account
  { path: 'dashboard', component: OwnerDashboard, canActivate: [ownerGuard] },
  { path: 'properties', component: MyProperties, canActivate: [ownerGuard] },
  { path: 'properties/new', component: PropertyRegister, canActivate: [ownerGuard] },
  { path: 'properties/:id/edit', component: PropertyEdit, canActivate: [ownerGuard] },
  { path: 'properties/:id/media', component: PropertyMedia, canActivate: [ownerGuard] },
  { path: 'properties/:id/availability', component: AvailabilityManager, canActivate: [ownerGuard] },
  { path: 'visits', component: ReceivedVisits, canActivate: [ownerGuard] },
  { path: 'contact-requests', component: ReceivedContactRequests, canActivate: [ownerGuard] },
  { path: 'applications', component: ReceivedApplications, canActivate: [ownerGuard] },
  { path: 'notifications', component: Notifications, canActivate: [ownerGuard] },
  { path: 'profile', component: Profile, canActivate: [ownerGuard] },

  // Fallback
  { path: '**', redirectTo: 'dashboard' }
];
