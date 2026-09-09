import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Suppress Zone.js performance tracking errors that don't affect functionality
if (typeof window !== 'undefined') {
  const originalError = console.error;
  console.error = function(...args: any[]) {
    const message = args[0]?.toString?.() || '';
    // Suppress the startTime error from Zone.js performance monitoring
    if (message.includes('Cannot read properties of undefined') && message.includes('startTime')) {
      return;
    }
    originalError.apply(console, args);
  };
}

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
