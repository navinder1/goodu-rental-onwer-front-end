import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  apiUrl = 'http://localhost:8080/api/users/me';

  user: any = null;
  loading = true;
  errorMessage = '';
  successMessage = '';

  editing = false;
  editName = '';
  editPhone = '';
  editProfileImage = '';

  ngOnInit(): void {
    this.getProfile();
  }

  getProfile(): void {

    this.http.get<any>(this.apiUrl).subscribe({

      next: (response) => {
        this.user = response.data;
        this.editName = this.user.name;
        this.editPhone = this.user.phone;
        this.editProfileImage = this.user.profileImage || '';
        this.loading = false;
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to load profile');
        this.loading = false;
      }

    });
  }

  startEdit(): void {
    this.editing = true;
    this.successMessage = '';
    this.errorMessage = '';
  }

  cancelEdit(): void {
    this.editing = false;
    this.editName = this.user.name;
    this.editPhone = this.user.phone;
    this.editProfileImage = this.user.profileImage || '';
  }

  saveProfile(): void {

    this.errorMessage = '';
    this.successMessage = '';

    this.http.put<any>(this.apiUrl, {
      name: this.editName,
      phone: this.editPhone,
      profileImage: this.editProfileImage || null
    }).subscribe({

      next: (response) => {
        this.user = response.data;
        this.editing = false;
        this.successMessage = 'Profile updated successfully.';
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to update profile.');
      }

    });

  }

  logout(): void {

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }

    this.router.navigate(['/auth']);

  }
}
