# MyDreamHouse — Owner Frontend

Angular 22 (standalone, SSR-enabled) frontend for **OWNER** accounts only.
One of three planned frontends (Tenant / Owner / Admin) against the same Spring Boot
backend — this one only talks to owner-facing endpoints.

## Run it

```
npm install
npm start
```
Runs on `http://localhost:4200`. Make sure the Spring Boot backend is running on
`http://localhost:8080` (hardcoded per-component, same convention as the base project —
see "API base URL" below).

## What's built

| Component | Route | What it does |
|---|---|---|
| `Auth` | `/auth` | Login — only lets OWNER accounts in, rejects RENTAL/ADMIN with a message |
| `Register` | `/register` | Registration — role hardcoded to OWNER (no picker) |
| `OwnerDashboard` | `/dashboard` | Landing page after login — property count, pending visits/applications, contact requests, unread notifications, all clickable |
| `MyProperties` | `/properties` | List your properties — edit, manage media, manage availability, mark rented, delete |
| `PropertyRegister` (existing, fixed up) | `/properties/new` | Create a new listing — removed a duplicate internal navbar that was double-rendering, added error display |
| `PropertyEdit` | `/properties/:id/edit` | Update a property (pre-filled form, PUT) |
| `PropertyMedia` | `/properties/:id/media` | Add/remove photo & video URLs |
| `AvailabilityManager` | `/properties/:id/availability` | Set weekly visit slots |
| `ReceivedVisits` | `/visits` | Confirm/reject requested visits, mark confirmed ones completed |
| `ReceivedContactRequests` | `/contact-requests` | View tenant messages |
| `ReceivedApplications` | `/applications` | Accept/reject rental applications (accepting auto-marks the property RENTED on the backend) |
| `Notifications` | `/notifications` | In-app notifications, mark as read, unread badge in the navbar |
| `Profile` | `/profile` | View/edit profile, logout |

## Auth & routing

- `owner.guard.ts` blocks every route except `/auth` and `/register` unless
  `localStorage.role === 'OWNER'`.
- `auth.interceptor.ts` (already existed in the base project) attaches
  `Authorization: Bearer <token>` to every outgoing request automatically.
- Login stores `token` and `role` in `localStorage` and redirects to `/dashboard`.
  Logout (navbar menu or Profile page) clears both and redirects to `/auth`.

## What changed vs. the uploaded base project

- Removed `home-page` (tenant-only browsing/search) — doesn't belong in the owner app.
- `property-register` had its own internal `<header class="navbar">` that duplicated the
  global app shell's header — removed it, so there's no more double-navbar when it renders
  inside `<router-outlet>`.
- Replaced the tenant-style search-bar header with a management-focused navbar: Dashboard /
  My Properties / Visits / Applications / Contact Requests, a "+ List Property" button, a
  notification bell with unread badge, and a dropdown menu with Logout.

## API base URL

Every component calls `http://localhost:8080/api/...` directly — matching how the original
`auth.ts` / `register.ts` / `property-register.ts` were already written. If you deploy the
backend elsewhere, grep for `http://localhost:8080` across `src/app` and update it.

## Build verification

This was actually built with `npm install && ng build` before delivery — it compiles clean,
zero errors and zero warnings.

## Known gaps / next steps

- Property media only accepts a pasted URL — no drag-and-drop upload widget (matches the
  backend, which doesn't do file storage yet).
- No environment.ts / build-time API URL config — see "API base URL" above.
- The Tenant frontend is a separate, already-delivered project. The Admin frontend is not
  built yet.
