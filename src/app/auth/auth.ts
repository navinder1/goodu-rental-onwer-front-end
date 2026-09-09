
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [FormsModule, RouterLink],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {

  email = '';
  password = '';

  // Error message displayed on HTML
  errorMessage = '';

  // Loading state
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login() {

    // Clear previous error
    this.errorMessage = '';

    // Basic frontend validation
    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    const loginData = {
      email: this.email,
      password: this.password
    };

    this.isLoading = true;

    console.log('🔐 [AUTH] Attempting login with email:', this.email);

    this.http.post<any>(
      'http://localhost:8080/api/auth/login',
      loginData
    ).subscribe({

      next: (response) => {

        console.log('✅ [AUTH] Login successful:', response);
        console.log('✅ [AUTH] Token received:', response?.data?.accessToken ? 'YES' : 'NO');
        console.log('✅ [AUTH] Role:', response?.data?.user?.role);

        this.isLoading = false;

        try {

          const data = response.data;

          const token = data.accessToken;

          const role = data.user.role;

          // Check token
          if (!token) {
            this.errorMessage =
              'Login failed. Authentication token was not received.';
            return;
          }

          // Check role
          if (!role) {
            this.errorMessage =
              'Login failed. User role was not received.';
            return;
          }

          // Save token
          localStorage.setItem('token', token);

          // Save role
          localStorage.setItem('role', role);

          console.log('Role:', role);

          // This is the OWNER app — only OWNER accounts can log in here.
          if (role === 'OWNER') {

            this.router.navigate(['/dashboard']);

          } else {

            localStorage.removeItem('token');
            localStorage.removeItem('role');

            this.errorMessage =
              'This app is for property owners only. Tenants and admins should use their own app.';
          }

        } catch (error) {

          console.error('Response processing error:', error);

          this.errorMessage =
            'Something went wrong while processing the login response.';
        }
      },


      error: (error) => {

        console.error('❌ [AUTH] Login error:', error);
        console.error('❌ [AUTH] Error status:', error?.status);
        console.error('❌ [AUTH] Error message:', error?.error?.message || error?.message);

        this.isLoading = false;

        /*
         * HTTP STATUS ERRORS
         */

        if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Please check your internet connection or make sure the backend is running.';

        }

        else if (error.status === 400) {

          this.errorMessage =
            this.getBackendMessage(
              error,
              'Invalid login details. Please check your email and password.'
            );

        }

        else if (error.status === 401) {

          this.errorMessage =
            this.getBackendMessage(
              error,
              'Invalid email or password.'
            );

        }

        else if (error.status === 403) {

          this.errorMessage =
            'You do not have permission to access this account.';
        }

        else if (error.status === 404) {

          this.errorMessage =
            'Login service was not found. Please try again later.';
        }

        else if (error.status === 409) {

          this.errorMessage =
            this.getBackendMessage(
              error,
              'There is a conflict with your account.'
            );

        }

        else if (error.status >= 500) {

          this.errorMessage =
            'Server error. Please try again later.';
        }

        else {

          this.errorMessage =
            this.getBackendMessage(
              error,
              'Something went wrong. Please try again.'
            );
        }
      }

    });
  }


  /*
   * Extract message from backend response
   */
  private getBackendMessage(
    error: any,
    defaultMessage: string
  ): string {

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

}

