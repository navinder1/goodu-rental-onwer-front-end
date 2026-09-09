import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.css'
})
export class OwnerDashboard implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);

  apiUrl = 'http://localhost:8080/api';

  loading = true;
  errorMessage = '';

  propertyCount = 0;
  pendingVisitCount = 0;
  pendingApplicationCount = 0;
  contactRequestCount = 0;
  unreadNotifications = 0;

  ngOnInit(): void {
    this.loadCounts();
  }

  loadCounts(): void {

    this.loading = true;
    this.errorMessage = '';

    // My properties total
    this.http.get<any>(`${this.apiUrl}/properties/my?page=0&size=1`).subscribe({
      next: (r) => { this.propertyCount = r?.data?.totalElements || 0; },
      error: () => {}
    });

    // Visits received, count only REQUESTED ones as "pending"
    this.http.get<any>(`${this.apiUrl}/visits/received?page=0&size=50`).subscribe({
      next: (r) => {
        const content = r?.data?.content || [];
        this.pendingVisitCount = content.filter((v: any) => v.status === 'REQUESTED').length;
      },
      error: () => {}
    });

    // Applications received, count SUBMITTED/UNDER_REVIEW as "pending"
    this.http.get<any>(`${this.apiUrl}/applications/received?page=0&size=50`).subscribe({
      next: (r) => {
        const content = r?.data?.content || [];
        this.pendingApplicationCount = content.filter(
          (a: any) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW'
        ).length;
      },
      error: () => {}
    });

    // Contact requests received total
    this.http.get<any>(`${this.apiUrl}/contact-requests/received?page=0&size=1`).subscribe({
      next: (r) => { this.contactRequestCount = r?.data?.totalElements || 0; },
      error: () => {}
    });

    // Unread notifications
    this.http.get<any>(`${this.apiUrl}/notifications/unread-count`).subscribe({
      next: (r) => {
        this.unreadNotifications = r?.data?.unreadCount || 0;
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to load dashboard data.');
        this.loading = false;
      }
    });

  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
