import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-detailed-property-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detailed-property-search.component.html'
})
export class DetailedPropertySearchComponent {
  category: 'wohnungen' | 'häuser' = 'wohnungen';
  selectedPropertyType: string = '';
  bundeslandBezirk: string = '';
  plzOrt: string = '';
  priceMin: number | null = null;
  priceMax: number | null = null;
  areaMin: number | null = null;
  areaMax: number | null = null;
  rooms: number | null = null;
  newBuildingsOnly: boolean = false;
  availableImmediately: boolean = false;
  last48Hours: boolean = false;
  numberOfHits: number = 0;  // This will be updated with real data later

  wohnungenOptions = [
    'Wohnung mieten',
    'Wohnung kaufen',
    'Raum mieten',
    'Penthouse mieten',
    'Penthouse kaufen'
  ];

  hauserOptions = [
    'Haus kaufen',
    'Haus mieten'
  ];

  wohnungenTypes = [
    'Dachgeschoßwohnung',
    'Genossenschaftswohnung',
    'Penthousewohnung',
    'Erdgeschoßwohnung',
    'Loft/Studio',
    'Garconniere',
    'Maisonette',
    'Wohnung',
    'Sonstige'
  ];

  hauserTypes = [
    'Almhütte',
    'Doppelhaushälfte',
    'Genossenschaftshaus',
    'Reihenhaus',
    'Villa',
    'Bauernhaus',
    'Einfamilienhaus',
    'Landhaus',
    'Rohbau',
    'Bungalow',
    'Gartenhaus',
    'Mehrfamilienhaus',
    'Schloss',
    'Sonstige'
  ];

  freiflachenTypes = [
    'Balkon',
    'Dachterrasse',
    'Garten',
    'Loggia',
    'Terrasse',
    'Wintergarten'
  ];

  ausstattungTypes = [
    'Abstellraum',
    'Barrierefrei',
    'Carport',
    'Einbauküche',
    'Fahrstuhl',
    'Garage',
    'Keller',
    'Parkplatz',
    'Möbliert'
  ];

  selectedTypes: { [key: string]: boolean } = {};
  selectedFreiflachen: { [key: string]: boolean } = {};
  selectedAusstattung: { [key: string]: boolean } = {};

  constructor() {
    this.initializeSelectedTypes();
    this.initializeFreiflachen();
    this.initializeAusstattung();
  }

  initializeSelectedTypes() {
    this.wohnungenTypes.forEach(type => {
      this.selectedTypes[type] = false;
    });
    this.hauserTypes.forEach(type => {
      this.selectedTypes[type] = false;
    });
  }

  initializeFreiflachen() {
    this.freiflachenTypes.forEach(type => {
      this.selectedFreiflachen[type] = false;
    });
  }

  initializeAusstattung() {
    this.ausstattungTypes.forEach(type => {
      this.selectedAusstattung[type] = false;
    });
  }

  onPropertyTypeChange() {
    if (this.wohnungenOptions.includes(this.selectedPropertyType)) {
      this.category = 'wohnungen';
    } else if (this.hauserOptions.includes(this.selectedPropertyType)) {
      this.category = 'häuser';
    }
    this.initializeSelectedTypes();
  }

  showResults() {
    // This method will be implemented later to show the search results
    console.log('Showing search results');
  }
}