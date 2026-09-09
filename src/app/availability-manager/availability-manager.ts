import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-availability-manager',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './availability-manager.html',
  styleUrl: './availability-manager.css'
})
export class AvailabilityManager implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);

  propertyId!: number;
  slots: any[] = [];
  loading = true;
  errorMessage = '';
  successMessage = '';

  dayOfWeek = 'MONDAY';
  startTime = '10:00';
  endTime = '18:00';
  isAvailable = true;

  daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadSlots();
  }

  get apiUrl(): string {
    return `http://localhost:8080/api/properties/${this.propertyId}/availability`;
  }

  loadSlots(): void {

    this.loading = true;

    this.http.get<any>(this.apiUrl).subscribe({

      next: (response) => {
        this.slots = response.data || [];
        this.loading = false;
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Unable to load availability.');
        this.loading = false;
      }

    });

  }

  addSlot(): void {

    if (this.startTime >= this.endTime) {
      this.errorMessage = 'Start time must be before end time.';
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    this.http.post<any>(this.apiUrl, {
      dayOfWeek: this.dayOfWeek,
      startTime: `${this.startTime}:00`,
      endTime: `${this.endTime}:00`,
      isAvailable: this.isAvailable
    }).subscribe({

      next: () => {
        this.successMessage = 'Availability slot added.';
        this.loadSlots();
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to add slot.');
      }

    });

  }

  deleteSlot(slotId: number): void {

    this.http.delete<any>(`${this.apiUrl}/${slotId}`).subscribe({

      next: () => {
        this.slots = this.slots.filter(s => s.id !== slotId);
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to delete slot.');
      }

    });

  }
}
