import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { RealEstateListing } from '../models/real-estate-listing';

export type PropertyType = 'house' | 'apartment' | 'land' | 'commercial' | 'holiday' | 'other';
export type ListingType = 'sale' | 'rent';

@Injectable({
  providedIn: 'root'
})
export class RealEstateService {
  private apiUrl = 'http://localhost:3001/api/listings';

  constructor(private http: HttpClient) {
    // Add test listing immediately when service is created
    this.addTestListing();
  }

  private addTestListing() {
    const testListing: RealEstateListing = {
      title: 'Test Listing',
      propertyType: 'house',
      listingType: 'sale',
      price: 500000,
      location: {
        country: 'Austria',
        city: 'Vienna',
        postalCode: '1010',
        street: 'Test Street 1'
      },
      specifications: {
        livingArea: 150,
        rooms: 4
      },
      features: {
        hasBalcony: true,
        hasGarden: true,
        heating: ['gas'],
        floors: ['parquet']
      },
      contact: {
        name: 'Test User',
        email: 'test@example.com',
        phone: '+43 123 456789'
      },
      images: ['test-image.jpg'],
      description: 'Test description'
    };

    console.log('Attempting to create test listing:', testListing);
    
    this.createListing(testListing).subscribe({
      next: (response) => console.log('Test listing created successfully:', response),
      error: (error) => console.error('Error creating test listing:', error)
    });
  }

  createListing(listing: RealEstateListing): Observable<RealEstateListing> {
    return this.http.post<RealEstateListing>(this.apiUrl, listing);
  }

  getListings(filters: Partial<RealEstateListing>): Observable<RealEstateListing[]> {
    return this.http.get<RealEstateListing[]>(this.apiUrl, { params: filters as any });
  }

  getListing(id: number): Observable<RealEstateListing> {
    return this.http.get<RealEstateListing>(`${this.apiUrl}/listings/${id}`);
  }

  updateListing(id: number, listing: RealEstateListing): Observable<RealEstateListing> {
    return this.http.put<RealEstateListing>(`${this.apiUrl}/listings/${id}`, listing);
  }

  deleteListing(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/listings/${id}`);
  }
} 