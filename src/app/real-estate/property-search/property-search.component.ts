import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-property-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './property-search.component.html'
})
export class PropertySearchComponent {
  selectedCategory: 'wohnungen' | 'häuser' = 'wohnungen';
  selectedPropertyType: string = '';
  bundeslandBezirk: string = '';
  plzOrt: string = '';
  price: number | null = null;
  area: number | null = null;
  rooms: number | null = null;
  numberOfHits: number = 0;

  constructor(private router: Router) {}

  wohnungenOptions = [
    'Wohnung mieten',
    'Wohnung kaufen'
  ];

  hauserOptions = [
    'Haus kaufen',
    'Haus mieten'
  ];

  selectCategory(category: 'wohnungen' | 'häuser') {
    this.selectedCategory = category;
    this.selectedPropertyType = '';
  }

  navigateToDetailedSearch() {
    this.router.navigate(['/real-estate/detailed-property-search'], {
      replaceUrl: true  // This will replace the current URL in the browser history
    });
  }

  resetFilter() {
    this.selectedPropertyType = '';
    this.bundeslandBezirk = '';
    this.plzOrt = '';
    this.price = null;
    this.area = null;
    this.rooms = null;
  }

  showResults() {
    // Extract property type and listing type from selectedPropertyType
    let propertyType = 'apartment'; // default
    let listingType = 'rent';    // default
    
    if (this.selectedPropertyType) {
      if (this.selectedPropertyType.includes('Haus')) {
        propertyType = 'house';
      }
      if (this.selectedPropertyType.includes('kaufen')) {
        listingType = 'buy';
      }
    }

    this.router.navigate(['/real-estate/listings', propertyType, listingType]);
  }
}