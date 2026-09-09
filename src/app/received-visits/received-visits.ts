import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-received-visits',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './received-visits.html',
  styleUrl: './received-visits.css'
})
export class ReceivedVisits implements OnInit {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:8080/api/visits';

  visits: any[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  page = 0;
  size = 10;
  totalPages = 0;

  replyMessages: Record<number, string> = {};

  ngOnInit(): void {
    this.loadVisits();
  }

  loadVisits(): void {

    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.apiUrl}/received?page=${this.page}&size=${this.size}`).subscribe({

      next: (response) => {
        this.visits = response?.data?.content || [];
        this.totalPages = response?.data?.totalPages || 0;
        this.loading = false;
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Unable to load visit requests.');
        this.loading = false;
      }

    });

  }

  confirm(visitId: number): void {

    const message = this.replyMessages[visitId] || '';

    this.http.patch<any>(`${this.apiUrl}/${visitId}/confirm`, { message }).subscribe({

      next: () => {
        this.successMessage = 'Visit confirmed.';
        this.loadVisits();
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to confirm visit.');
      }

    });

  }

  reject(visitId: number): void {

    const message = this.replyMessages[visitId] || '';

    this.http.patch<any>(`${this.apiUrl}/${visitId}/reject`, { message }).subscribe({

      next: () => {
        this.successMessage = 'Visit rejected.';
        this.loadVisits();
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to reject visit.');
      }

    });

  }

  complete(visitId: number): void {

    this.http.patch<any>(`${this.apiUrl}/${visitId}/complete`, {}).subscribe({

      next: () => {
        this.successMessage = 'Visit marked as completed.';
        this.loadVisits();
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to complete visit.');
      }

    });

  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.loadVisits(); }
  }

  previousPage(): void {
    if (this.page > 0) { this.page--; this.loadVisits(); }
  }
}
