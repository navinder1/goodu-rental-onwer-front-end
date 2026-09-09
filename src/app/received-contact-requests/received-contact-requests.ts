import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-received-contact-requests',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './received-contact-requests.html',
  styleUrl: './received-contact-requests.css'
})
export class ReceivedContactRequests implements OnInit {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:8080/api/contact-requests';

  requests: any[] = [];
  loading = true;
  errorMessage = '';

  page = 0;
  size = 10;
  totalPages = 0;

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {

    this.loading = true;
    this.errorMessage = '';

    this.http.get<any>(`${this.apiUrl}/received?page=${this.page}&size=${this.size}`).subscribe({

      next: (response) => {
        this.requests = response?.data?.content || [];
        this.totalPages = response?.data?.totalPages || 0;
        this.loading = false;
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Unable to load contact requests.');
        this.loading = false;
      }

    });

  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.loadRequests(); }
  }

  previousPage(): void {
    if (this.page > 0) { this.page--; this.loadRequests(); }
  }
}
