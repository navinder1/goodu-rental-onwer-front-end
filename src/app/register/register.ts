
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  email = '';
  phone = '';
  password = '';
  role = 'OWNER'; // This is the Owner app — every registration here is an OWNER account.

  // UI state
  errorMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  register() {

    // Clear previous error
    this.errorMessage = '';

    // Basic validation
    if (!this.name.trim()) {
      this.errorMessage = 'Please enter your name.';
      return;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'Please enter your email.';
      return;
    }

    if (!this.phone.trim()) {
      this.errorMessage = 'Please enter your phone number.';
      return;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Please enter your password.';
      return;
    }

    // Registration data
    const regData = {
      name: this.name,
      email: this.email,
      phone: this.phone,
      password: this.password,
      role: this.role
    };

    console.log('Registration Data:', regData);

    this.isLoading = true;

    this.http.post<any>(
      'http://localhost:8080/api/auth/register',
      regData
    ).subscribe({

      // ==============================
      // SUCCESS
      // ==============================

      next: (response) => {

        this.isLoading = false;

        console.log(
          'Registration successful:',
          response
        );

        // Go to login page
        this.router.navigate(['/auth']);
      },


      // ==============================
      // ERROR
      // ==============================

      error: (error) => {

        this.isLoading = false;

        console.error(
          'Registration failed:',
          error
        );


        // Backend not reachable
        if (error.status === 0) {

          this.errorMessage =
            'Unable to connect to the server. Please make sure the backend is running.';

        }


        // Bad request
        else if (error.status === 400) {

          this.errorMessage =
            error.error?.message ||
            'Please check the information you entered.';

        }


        // Email already exists
        else if (error.status === 409) {

          this.errorMessage =
            error.error?.message ||
            'An account with this email already exists.';

        }


        // Unauthorized
        else if (error.status === 401) {

          this.errorMessage =
            error.error?.message ||
            'You are not authorized to perform this action.';

        }


        // Forbidden
        else if (error.status === 403) {

          this.errorMessage =
            error.error?.message ||
            'You do not have permission to register this account.';

        }


        // Server error
        else if (error.status >= 500) {

          this.errorMessage =
            'Server error. Please try again later.';

        }


        // Unknown error
        else {

          this.errorMessage =
            error.error?.message ||
            'Registration failed. Please try again.';
        }

      }

    });
  }
}

