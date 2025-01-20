import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NewRealEstateListingComponent } from './new-listing/new-real-estate-listing/new-real-estate-listing.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    NewRealEstateListingComponent // Import the standalone component
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { } 