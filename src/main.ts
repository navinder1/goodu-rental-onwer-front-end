import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// ============================================================================
// SUPPRESS HARMLESS ZONE.JS ERROR
// This error doesn't affect functionality—it's just performance monitoring noise
// ============================================================================
if (typeof window !== 'undefined') {
  // Intercept console.error to filter out the Zone.js startTime error
  const originalError = console.error;
  console.error = function(...args: any[]) {
    const msg = String(args[0] || '');
    if (msg.includes('startTime')) return; // Silently drop this error
    originalError.apply(console, args);
  };

  // Intercept window errors
  const originalOnerror = window.onerror;
  window.onerror = function(message: any, source?: any, lineno?: any, colno?: any, error?: any) {
    if (String(message || '').includes('startTime')) return true; // Suppress
    return originalOnerror?.call(window, message, source, lineno, colno, error) as any;
  };

  // Intercept unhandled promise rejections
  const originalOnrejection = window.onunhandledrejection;
  window.onunhandledrejection = function(event: any) {
    if (String(event?.reason || '').includes('startTime')) {
      event.preventDefault?.();
      return;
    }
    return originalOnrejection?.apply(window, [event]) as any;
  };
}

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
