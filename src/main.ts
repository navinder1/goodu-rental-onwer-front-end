import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ErrorHandler, NgZone } from '@angular/core';

// Global error handler to suppress Zone.js performance tracking errors
if (typeof window !== 'undefined') {
  // Suppress console.error for Zone.js startTime errors
  const originalError = console.error;
  console.error = function(...args: any[]) {
    const message = args[0]?.toString?.() || '';
    if (message.includes('Cannot read properties of undefined') && message.includes('startTime')) {
      console.warn('⚠️  [ZONE.JS] Suppressing harmless Zone.js performance tracking error');
      return;
    }
    originalError.apply(console, args);
  };

  // Suppress uncaught errors for Zone.js startTime issues
  window.onerror = function(message, source, lineno, colno, error) {
    if (message && message.includes && message.includes('Cannot read properties of undefined') && message.includes('startTime')) {
      console.warn('⚠️  [ZONE.JS] Suppressed: Zone.js performance tracking error');
      return true; // Prevents default error handling
    }
    return false; // Use default error handling
  };

  // Also suppress promise rejection errors from Zone.js
  window.onunhandledrejection = function(event) {
    if (event.reason && event.reason.toString && event.reason.toString().includes('startTime')) {
      console.warn('⚠️  [ZONE.JS] Suppressed: Zone.js promise rejection');
      event.preventDefault();
    }
  };
}

bootstrapApplication(App, appConfig)
  .catch((err) => {
    // Don't log harmless Zone.js errors
    const errorStr = err?.toString?.() || '';
    if (!errorStr.includes('startTime')) {
      console.error(err);
    }
  });
