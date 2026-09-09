import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  isLoggedIn = false;
  menuOpen = false;
  unreadCount = 0;

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = !!localStorage.getItem('token');
      if (this.isLoggedIn) {
        this.loadUnreadCount();
      }
    }
  }

  loadUnreadCount(): void {

    this.http.get<any>(
      'http://localhost:8080/api/notifications/unread-count'
    ).subscribe({

      next: (response) => {
        this.unreadCount = response?.data?.unreadCount || 0;
      },

      error: (error) => {
        console.error('Failed to load unread count:', error);
      }

    });
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }

  logout(): void {

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }

    this.isLoggedIn = false;
    this.menuOpen = false;
    this.router.navigate(['/auth']);
  }
}
