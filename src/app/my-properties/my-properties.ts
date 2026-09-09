import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './my-properties.html',
  styleUrl: './my-properties.css'
})
export class MyProperties implements OnInit {

  private http = inject(HttpClient);
  private router = inject(Router);

  apiUrl = 'http://localhost:8080/api/properties';

  properties: any[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  page = 0;
  size = 10;
  totalPages = 0;

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {

    this.loading = true;
    this.errorMessage = '';

    // Build pageable params correctly for Spring - page is 0-indexed
    const params = new URLSearchParams({
      page: this.page.toString(),
      size: this.size.toString()
    });

    this.http.get<any>(`${this.apiUrl}/my?${params.toString()}`).subscribe({

      next: (response) => {
        console.log('Properties response:', response); // DEBUG
        
        // Try multiple paths to handle different response structures
        const pageData = response?.data || response;
        this.properties = pageData?.content || pageData || [];
        this.totalPages = pageData?.totalPages || 0;
        
        console.log('Parsed properties:', this.properties, 'Total pages:', this.totalPages); // DEBUG
        this.loading = false;
      },

      error: (error) => {
        console.error('Error loading properties:', error); // DEBUG
        this.errorMessage = getBackendMessage(error, 'Unable to load your properties.');
        this.loading = false;
      }

    });

  }

  addNew(): void {
    this.router.navigate(['/properties/new']);
  }

  editProperty(id: number): void {
    this.router.navigate(['/properties', id, 'edit']);
  }

  manageMedia(id: number): void {
    this.router.navigate(['/properties', id, 'media']);
  }

  manageAvailability(id: number): void {
    this.router.navigate(['/properties', id, 'availability']);
  }

  markAsRented(id: number): void {

    this.successMessage = '';
    this.errorMessage = '';

    this.http.patch<any>(`${this.apiUrl}/${id}/mark-rented`, {}).subscribe({

      next: () => {
        this.successMessage = 'Property marked as rented.';
        this.loadProperties();
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to update property status.');
      }

    });

  }

  deleteProperty(id: number): void {

    if (!confirm('Delete this property? This cannot be undone.')) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    this.http.delete<any>(`${this.apiUrl}/${id}`).subscribe({

      next: () => {
        this.successMessage = 'Property deleted.';
        this.properties = this.properties.filter(p => p.id !== id);
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to delete property.');
      }

    });

  }

  nextPage(): void {
    if (this.page < this.totalPages - 1) { this.page++; this.loadProperties(); }
  }

  previousPage(): void {
    if (this.page > 0) { this.page--; this.loadProperties(); }
  }
}
