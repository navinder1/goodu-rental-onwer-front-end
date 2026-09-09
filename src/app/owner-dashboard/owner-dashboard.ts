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

    console.log('📊 [DASHBOARD] Loading dashboard counts...');

    // My properties total
    console.log('📋 [DASHBOARD] Fetching properties count...');
    this.http.get<any>(`${this.apiUrl}/properties/my?page=0&size=1`).subscribe({
      next: (r) => {
        this.propertyCount = r?.data?.totalElements || 0;
        console.log('✅ [DASHBOARD] Properties count:', this.propertyCount);
      },
      error: (e) => { console.error('❌ [DASHBOARD] Properties error:', e); }
    });

    // Visits received, count only REQUESTED ones as "pending"
    console.log('🏠 [DASHBOARD] Fetching visits...');
    this.http.get<any>(`${this.apiUrl}/visits/received?page=0&size=50`).subscribe({
      next: (r) => {
        const content = r?.data?.content || [];
        this.pendingVisitCount = content.filter((v: any) => v.status === 'REQUESTED').length;
        console.log('✅ [DASHBOARD] Visits fetched:', content.length, 'Pending:', this.pendingVisitCount);
      },
      error: (e) => { console.error('❌ [DASHBOARD] Visits error:', e); }
    });

    // Applications received, count SUBMITTED/UNDER_REVIEW as "pending"
    console.log('📝 [DASHBOARD] Fetching applications...');
    this.http.get<any>(`${this.apiUrl}/applications/received?page=0&size=50`).subscribe({
      next: (r) => {
        const content = r?.data?.content || [];
        this.pendingApplicationCount = content.filter(
          (a: any) => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW'
        ).length;
        console.log('✅ [DASHBOARD] Applications fetched:', content.length, 'Pending:', this.pendingApplicationCount);
      },
      error: (e) => { console.error('❌ [DASHBOARD] Applications error:', e); }
    });

    // Contact requests received total
    console.log('📞 [DASHBOARD] Fetching contact requests...');
    this.http.get<any>(`${this.apiUrl}/contact-requests/received?page=0&size=1`).subscribe({
      next: (r) => {
        this.contactRequestCount = r?.data?.totalElements || 0;
        console.log('✅ [DASHBOARD] Contact requests count:', this.contactRequestCount);
      },
      error: (e) => { console.error('❌ [DASHBOARD] Contact requests error:', e); }
    });

    // Unread notifications
    console.log('🔔 [DASHBOARD] Fetching unread notifications count...');
    this.http.get<any>(`${this.apiUrl}/notifications/unread-count`).subscribe({
      next: (r) => {
        this.unreadNotifications = r?.data?.unreadCount || 0;
        console.log('✅ [DASHBOARD] Unread notifications:', this.unreadNotifications);
        this.loading = false;
        console.log('✅ [DASHBOARD] All dashboard data loaded!');
      },
      error: (error) => {
        console.error('❌ [DASHBOARD] Failed to load unread count:', error);
        this.errorMessage = getBackendMessage(error, 'Failed to load dashboard data.');
        this.loading = false;
      }
    });

  }

  goTo(path: string): void {
    this.router.navigate([path]);
  }
}
