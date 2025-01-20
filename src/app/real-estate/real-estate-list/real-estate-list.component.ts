import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RealEstateService } from '../../services/real-estate.service';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RealEstateListing } from '../../models/real-estate-listing';

@Component({
  selector: 'app-real-estate-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './real-estate-list.component.html'
})
export class RealEstateListComponent implements OnInit {
  listings: any[] = [];
  propertyType: string = '';
  listingType: string = '';
  selectedCategory: string = '';
  newBuildingsOnly: boolean = false;
  selectedTypes: { [key: string]: boolean } = {};
  selectedFreiflachen: { [key: string]: boolean } = {};
  selectedAusstattung: { [key: string]: boolean } = {};
  availableImmediately: boolean = false;
  last48Hours: boolean = false;
  currentPage: number = 1;
  totalPages: number = 10;
  selectedSort: string = '';

  wohnungenTypes: string[] = ['Garconniere', 'Apartment', 'Maisonette', 'Loft', 'Penthouse'];
  hauserTypes: string[] = ['Einfamilienhaus', 'Doppelhaushälfte', 'Reihenhaus', 'Villa'];
  freiflachenTypes: string[] = ['Balkon', 'Terrasse', 'Garten', 'Loggia'];
  ausstattungTypes: string[] = ['Einbauküche', 'Lift', 'Keller', 'Garage'];
  sortOptions = [
    { value: 'price-asc', label: 'Preis aufsteigend' },
    { value: 'price-desc', label: 'Preis absteigend' },
    { value: 'date-desc', label: 'Neueste zuerst' }
  ];

  constructor(
    private realEstateService: RealEstateService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyType = params['propertyType'];
      this.listingType = params['listingType'];
      console.log('Loading listings with params:', { propertyType: this.propertyType, listingType: this.listingType });
      this.loadListings();
    });
  }

  loadListings() {
    const filters: Partial<RealEstateListing> = {
      propertyType: this.propertyType,
      listingType: this.listingType
    };
    
    this.realEstateService.getListings(filters).subscribe({
      next: (listings) => {
        this.listings = listings;
      },
      error: (error) => {
        console.error('Error loading listings:', error);
      }
    });
  }

  onCategoryChange(event: any): void {
    // Implement category change logic
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
  }

  getPages(): number[] {
    return Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  onSortChange(): void {
    // Implement sort change logic
  }
}
