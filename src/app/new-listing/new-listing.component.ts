import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-listing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './new-listing.component.html'
})
export class NewListingComponent {
  constructor(private router: Router) {}

  navigateToNewRealEstateListing() {
    this.router.navigate(['/new-listing/new-real-estate-listing']);
  }
}