import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-received-applications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './received-applications.html',
  styleUrl: './received-applications.css'
})
export class ReceivedApplications implements OnInit {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:8080/api/applications';

  applications: any[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  page = 0;
  size = 10;
  totalPages = 0;

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {

    this.loading = true;
    this.errorMessage = '';

    console.log('📋 [APPLICATIONS] Loading received applications... Page:', this.page);

    this.http.get<any>(`${this.apiUrl}/received?page=${this.page}&size=${this.size}`).subscribe({

      next: (response) => {
        this.applications = response?.data?.content || [];
        this.totalPages = response?.data?.totalPages || 0;
        console.log('✅ [APPLICATIONS] Loaded', this.applications.length, 'applications');
        this.loading = false;
      },

      error: (error) => {
        console.error('❌ [APPLICATIONS] Error loading applications:', error);
        this.errorMessage = getBackendMessage(error, 'Unable to load applications.');
        this.loading = false;
      }

    });

  }

  accept(applicationId: number): void {

    this.successMessage = '';
    this.errorMessage = '';

    console.log('✔️ [APPLICATIONS] Accepting application', applicationId);

    this.http.patch<any>(`${this.apiUrl}/${applicationId}/accept`, {}).subscribe({

      next: () => {
        this.successMessage = 'Application accepted. Property has been marked as rented.';
        this.loadApplications();
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to accept application.');
      }

    });

  }

  reject(applicationId: number): void {

    this.successMessage = '';
    this.errorMessage = '';

    this.http.patch<any>(`${this.apiUrl}/${applicationId}/reject`, {}).subscribe({

      next: () => {
        this.successMessage = 'Application rejected.';
        this.loadApplications();
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to reject application.');
      }

    });

  }

  canDecide(app: any): boolean {
    return app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW';
  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.loadApplications(); }
  }

  previousPage(): void {
    if (this.page > 0) { this.page--; this.loadApplications(); }
  }
}
