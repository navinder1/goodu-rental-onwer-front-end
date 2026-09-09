// Small shared helper so every component doesn't repeat the same status-code
// switch statement. Kept as a plain function (not a service) since it has no
// state and every component already imports HttpClient directly.
export function getBackendMessage(error: any, defaultMessage: string): string {

  if (error.status === 0) {
    return 'Unable to connect to the server. Please make sure the backend is running.';
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  if (error?.error?.error) {
    return error.error.error;
  }

  if (typeof error?.error === 'string') {
    return error.error;
  }

  if (error?.message) {
    return error.message;
  }

  return defaultMessage;
}
