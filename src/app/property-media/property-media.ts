import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-property-media',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './property-media.html',
  styleUrl: './property-media.css'
})
export class PropertyMedia implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  propertyId!: number;
  media: any[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  mediaUrl = '';
  mediaType = 'IMAGE';
  isPrimary = false;

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMedia();
  }

  get apiUrl(): string {
    return `http://localhost:8080/api/properties/${this.propertyId}/media`;
  }

  loadMedia(): void {

    this.loading = true;

    console.log('🖼️  [MEDIA] Loading media for property', this.propertyId);

    this.http.get<any>(this.apiUrl).subscribe({

      next: (response) => {
        this.media = response.data || [];
        console.log('✅ [MEDIA] Loaded', this.media.length, 'media files');
        this.loading = false;
      },

      error: (error) => {
        console.error('❌ [MEDIA] Error loading media:', error);
        this.errorMessage = getBackendMessage(error, 'Unable to load media.');
        this.loading = false;
      }

    });

  }

  addMedia(): void {

    if (!this.mediaUrl.trim()) {
      this.errorMessage = 'Please provide a media URL.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    console.log('📤 [MEDIA] Adding media:', this.mediaType);

    this.http.post<any>(this.apiUrl, {
      mediaUrl: this.mediaUrl,
      mediaType: this.mediaType,
      isPrimary: this.isPrimary
    }).subscribe({

      next: () => {
        console.log('✅ [MEDIA] Media added successfully');
        this.successMessage = 'Media added.';
        this.mediaUrl = '';
        this.isPrimary = false;
        this.loadMedia();
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to add media.');
      }

    });

  }

  deleteMedia(mediaId: number): void {

    this.http.delete<any>(`${this.apiUrl}/${mediaId}`).subscribe({

      next: () => {
        this.media = this.media.filter(m => m.id !== mediaId);
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to delete media.');
      }

    });

  }
}
