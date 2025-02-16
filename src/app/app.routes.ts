import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { RealEstateComponent } from './real-estate/real-estate.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { PropertySearchComponent } from './real-estate/property-search/property-search.component';
import { DetailedPropertySearchComponent } from './real-estate/property-search/detailed-property-search/detailed-property-search.component';
import { NewListingComponent } from './new-listing/new-listing.component';
import { NewRealEstateListingComponent } from './new-listing/new-real-estate-listing/new-real-estate-listing.component';
import { RealEstateListComponent } from './real-estate/real-estate-list/real-estate-list.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    { 
        path: 'vehicles', 
        component: VehiclesComponent 
    },
    { 
        path: 'vehicle-detail/:id', 
        component: VehicleDetailComponent 
    },
    { 
        path: 'real-estate', 
        component: RealEstateComponent,
        children: [
            {
                path: '',
                component: PropertySearchComponent
            },
            {
                path: 'detailed-property-search',
                component: DetailedPropertySearchComponent
            }
        ]
    },
    { 
        path: 'login', 
        component: LoginComponent 
    },
    { 
        path: 'register',
         component: RegisterComponent
    },
    { 
        path: 'profile',
         component: ProfileComponent
    },
    {
        path: 'new-listing',
        component: NewListingComponent
    },
    {
        path: 'new-listing/new-real-estate-listing',
        component: NewRealEstateListingComponent
    },
    {
        path: 'real-estate/listings/:propertyType/:listingType',
        component: RealEstateListComponent
    },
    {
        path: 'real-estate/detailed-search',
        component: DetailedPropertySearchComponent
    },
    // { path: 'protected', component: ProtectedComponent, canActivate: [AuthGuard] },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }