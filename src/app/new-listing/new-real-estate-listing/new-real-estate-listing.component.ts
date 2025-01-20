import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RealEstateListing } from '../../models/real-estate-listing';
import { RealEstateService } from '../../services/real-estate.service';

@Component({
  selector: 'app-new-real-estate-listing',
  templateUrl: './new-real-estate-listing.component.html',
  styleUrls: ['./new-real-estate-listing.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NewRealEstateListingComponent {
  listing: RealEstateListing = {
    title: '',
    propertyType: '',
    listingType: '',
    price: 0,
    location: {
      country: 'Austria',
      city: '',
      postalCode: '',
      street: ''
    },
    specifications: {
      livingArea: 0,
      rooms: 0
    },
    features: {
      hasBalcony: false,
      hasGarden: false,
      heating: [],
      floors: []
    },
    contact: {
      name: '',
      email: '',
      phone: ''
    },
    images: [''],
    description: ''
  };

  showListingForm = false;
  showHouseOptions = false;
  showApartmentOptions = false;

  constructor(private realEstateService: RealEstateService) {}

  toggleHouseOptions() {
    this.showHouseOptions = !this.showHouseOptions;
    this.showApartmentOptions = false;
  }

  toggleApartmentOptions() {
    this.showApartmentOptions = !this.showApartmentOptions;
    this.showHouseOptions = false;
  }

  navigateToForm(propertyType: string, listingType: string) {
    this.listing.propertyType = propertyType;
    this.listing.listingType = listingType;
    this.showListingForm = true;
  }

  onSubmit() {
    this.realEstateService.createListing(this.listing).subscribe({
      next: (response) => {
        console.log('Listing created successfully:', response);
        // Reset form or navigate away
      },
      error: (error) => {
        console.error('Error creating listing:', error);
      }
    });
  }
}
