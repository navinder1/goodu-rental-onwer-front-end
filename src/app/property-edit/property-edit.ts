import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-property-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './property-edit.html',
  styleUrl: './property-edit.css'
})
export class PropertyEdit implements OnInit {

  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  apiUrl = 'http://localhost:8080/api/properties';
  propertyId!: number;

  loading = true;
  saving = false;
  errorMessage = '';

  title = '';
  description = '';
  propertyType = '';

  bhk: number | null = null;
  area: number | null = null;
  floor: number | null = null;
  totalFloors: number | null = null;

  address = '';
  city = '';
  state = '';
  pincode = '';

  latitude: number | null = null;
  longitude: number | null = null;

  monthlyRent: number | null = null;
  deposit: number | null = null;
  availableFrom = '';

  parkingAvailable = false;
  waterAvailable = false;
  electricityAvailable = false;

  tenantPreference = '';

  propertyTypes = ['APARTMENT', 'INDEPENDENT_HOUSE', 'VILLA', 'PG', 'STUDIO', 'PLOT'];

  ngOnInit(): void {

    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProperty();

  }

  loadProperty(): void {

    this.loading = true;

    console.log('📝 [PROPERTY-EDIT] Loading property', this.propertyId);

    this.http.get<any>(`${this.apiUrl}/${this.propertyId}`).subscribe({

      next: (response) => {

        const p = response.data;
        console.log('✅ [PROPERTY-EDIT] Property loaded:', p.title);

        this.title = p.title;
        this.description = p.description;
        this.propertyType = p.propertyType;
        this.bhk = p.bhk;
        this.area = p.area;
        this.floor = p.floor;
        this.totalFloors = p.totalFloors;
        this.address = p.address;
        this.city = p.city;
        this.state = p.state;
        this.pincode = p.pincode;
        this.latitude = p.latitude;
        this.longitude = p.longitude;
        this.monthlyRent = p.monthlyRent;
        this.deposit = p.deposit;
        this.availableFrom = p.availableFrom;
        this.parkingAvailable = p.parkingAvailable;
        this.waterAvailable = p.waterAvailable;
        this.electricityAvailable = p.electricityAvailable;
        this.tenantPreference = p.tenantPreference;

        this.loading = false;
      },

      error: (error) => {
        console.error('❌ [PROPERTY-EDIT] Error loading property:', error);
        this.errorMessage = getBackendMessage(error, 'Unable to load this property.');
        this.loading = false;
      }

    });

  }

  saveChanges(): void {

    this.errorMessage = '';
    this.saving = true;

    const body = {
      title: this.title,
      description: this.description,
      propertyType: this.propertyType,
      bhk: this.bhk,
      area: this.area,
      floor: this.floor,
      totalFloors: this.totalFloors,
      address: this.address,
      city: this.city,
      state: this.state,
      pincode: this.pincode,
      latitude: this.latitude,
      longitude: this.longitude,
      monthlyRent: this.monthlyRent,
      deposit: this.deposit,
      availableFrom: this.availableFrom,
      parkingAvailable: this.parkingAvailable,
      waterAvailable: this.waterAvailable,
      electricityAvailable: this.electricityAvailable,
      tenantPreference: this.tenantPreference
    };

    this.http.put<any>(`${this.apiUrl}/${this.propertyId}`, body).subscribe({

      next: () => {
        this.router.navigate(['/properties']);
      },

      error: (error) => {
        this.errorMessage = getBackendMessage(error, 'Failed to update property.');
        this.saving = false;
      }

    });

  }
}
