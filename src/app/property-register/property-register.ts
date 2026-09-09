import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { getBackendMessage } from '../error-message.util';

@Component({
  selector: 'app-property-register',
  imports: [FormsModule, CommonModule],
  templateUrl: './property-register.html',
  styleUrl: './property-register.css'
})
export class PropertyRegister {

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

  // Facilities
  parkingAvailable = false;
  waterAvailable = false;
  electricityAvailable = false;

  // Tenant preference
  tenantPreference = '';

  // Property types
  propertyTypes = [
  'APARTMENT',
  'INDEPENDENT_HOUSE',
  'VILLA',
  'PG',
  'STUDIO',
  'PLOT'
];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registerProperty() {

    const propertyData = {
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

    console.log('📝 [PROPERTY-REGISTER] Registering property...');
    console.log('🏠 [PROPERTY-REGISTER] Property data:', propertyData);

    this.errorMessage = '';

    this.http.post(
      'http://localhost:8080/api/properties',
      propertyData
    ).subscribe({

      next: (response) => {
        console.log('Property registered successfully:', response);

        this.router.navigate(['/properties']);
      },

      error: (error) => {
        console.error('Property registration failed:', error);
        this.errorMessage = getBackendMessage(error, 'Failed to create property.');
      }

    });
  }
}