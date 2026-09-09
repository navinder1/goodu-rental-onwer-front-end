import { RenderMode, ServerRoute } from '@angular/ssr';

// Everything here depends on the backend API and/or localStorage auth state,
// so render on each request rather than prerendering static HTML at build time.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server
  }
];
