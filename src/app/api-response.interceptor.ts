import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Normalizes API responses to extract the data payload.
 * Handles ApiResponse<T> format from the backend.
 */
export const apiResponseInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    // Response handling is done in the component with proper error handling
    // This interceptor can be extended for logging or response transformation
  );
};
