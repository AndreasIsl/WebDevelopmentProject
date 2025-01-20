import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface RealEstateListing {
  id?: number;
  title: string;
  property_type: string;
  listing_type: string;   // Will be either "buy" or "rent"
  price: number;
  location: {
    country: string;
    city: string;
    postalCode: string;
    street: string;
  };
  specifications: {
    livingArea: number;
    rooms: number;
  };
  features?: {
    hasBalcony: boolean;
    hasGarden: boolean;
    heating: string[];
    floors: string[];
  };
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  images: string[];
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class RealEstateService {
  private apiUrl = 'http://localhost:3001/api';
  private defaultImage = '../../../assets/images/home.jpg';

  constructor(private http: HttpClient) { }

  getListings(propertyType: string, listingType: string): Observable<RealEstateListing[]> {
    return this.http.get<RealEstateListing[]>(`${this.apiUrl}/listings`, {
      params: {
        propertyType: propertyType,
        listingType: listingType
      }
    }).pipe(
      map(listings => listings.map(listing => ({
        ...listing,
        // If no images or empty images array, use default image
        images: listing.images?.length ? listing.images : [this.defaultImage]
      })))
    );
  }

  createListing(listing: RealEstateListing): Observable<RealEstateListing> {
    // If no images provided, use default image
    if (!listing.images || listing.images.length === 0) {
      listing.images = [this.defaultImage];
    }
    return this.http.post<RealEstateListing>(`${this.apiUrl}/listings`, listing);
  }
}