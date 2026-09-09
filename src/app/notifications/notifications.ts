import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {

  private http = inject(HttpClient);

  apiUrl = 'http://localhost:8080/api/notifications';

  notifications: any[] = [];
  loading = true;
  errorMessage = '';

  page = 0;
  size = 20;
  totalPages = 0;

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {

    this.loading = true;
    this.errorMessage = '';

    console.log('🔔 [NOTIFICATIONS] Loading notifications... Page:', this.page);

    this.http.get<any>(`${this.apiUrl}?page=${this.page}&size=${this.size}`).subscribe({

      next: (response) => {
        this.notifications = response?.data?.content || [];
        this.totalPages = response?.data?.totalPages || 0;
        console.log('✅ [NOTIFICATIONS] Loaded', this.notifications.length, 'notifications');
        this.loading = false;
      },

      error: (error) => {
        console.error('❌ [NOTIFICATIONS] Error loading notifications:', error);
        this.errorMessage = getBackendMessage(error, 'Unable to load notifications.');
        this.loading = false;
      }

    });

  }

  markAsRead(notification: any): void {

    if (notification.isRead) return;

    console.log('📬 [NOTIFICATIONS] Marking notification', notification.id, 'as read');

    this.http.patch<any>(`${this.apiUrl}/${notification.id}/read`, {}).subscribe({

      next: () => {
        notification.isRead = true;
        console.log('✅ [NOTIFICATIONS] Notification', notification.id, 'marked as read');
      },

      error: (error) => {
        console.error('❌ [NOTIFICATIONS] Failed to mark as read:', getBackendMessage(error, ''));
      }

    });

  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.loadNotifications(); }
  }

  previousPage(): void {
    if (this.page > 0) { this.page--; this.loadNotifications(); }
  }
}
