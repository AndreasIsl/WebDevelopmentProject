import { ChangeDetectorRef, Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { log } from 'console';
import { Router } from '@angular/router';
@Component({
  selector: 'app-vehicles',
  imports: [NgIf, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent {

  categoryForm: FormGroup;
  filterForm: FormGroup;
  isVisible = false;
  vehicles: any[] = [];
  vehiclesCategorized: any[] = [];
  filteredVehicles: any[] = [];
  brands: string[] = [];
  manufactoringDates: number[] = [];
  ids: number[] = [];
  reload = false;

  constructor(private fb: FormBuilder,private cd: ChangeDetectorRef,private router: Router) {
    this.getVehicles();
    this.filterForm = this.fb.group({
      id:[''],
      manufactoringDate:[''],
      selection:['cars']
    }, {});
    
    this.categoryForm = this.fb.group({
      category_car:[''],
      category_motorcycle:[''],
      search:[''],
    }, {});
  }

  setPlaceholderImage() {
    this.vehicles.forEach((vehicle) => {
      if (vehicle.bilder == null || vehicle.bilder.length == 0) {
        vehicle.Image = '../assets/images/car_placeholder_image.png';
      } else {
        vehicle.Image = vehicle.bilder[0];
      }
    })
  }

  async getVehicles() {
    try {
      const response = await fetch('http://localhost:5001/vehicles');
      const data = await response.json();
      this.vehicles = data;
      this.vehiclesCategorized = data;
      this.filteredVehicles = data;

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(data);
      this.fillFilterArrays();
      this.setPlaceholderImage();
    } catch (err) {
      console.error(err);
    }
  }


  
  fillFilterArrays() {
    this.brands = [];
    this.manufactoringDates = [];
    this.ids = [];

    this.vehiclesCategorized.forEach((vehicle) => {
      this.brands.push(vehicle.marke);
      this.manufactoringDates.push(vehicle.baujahr);
      this.ids.push(vehicle.id);
    });

  this.brands = Array.from(new Set(this.brands));
  this.manufactoringDates = Array.from(new Set(this.manufactoringDates));
    
  this.brands.forEach((brand) => {
    this.filterForm.addControl(brand.toString(), this.fb.control(false));
  });
    console.log('Dates:', this.manufactoringDates);
  this.manufactoringDates.sort((a, b) => a - b);
    console.log('Dates:', this.manufactoringDates);
    this.cd.detectChanges();
  }

  onSubmit() {
    const brandsToSelect : any = [];
    this.brands.forEach((brand) => {
      if(this.filterForm.value[brand]) {
        brandsToSelect.push(brand);
      }
    });

    const id = this.filterForm.value['id'];
    const manDate = this.filterForm.get('manufactoringDate')?.value
    console.log('<------------------------------Filter------------------------------------>');
    console.log(
      `Brand: ${brandsToSelect},
       Manufactoring Date: ${manDate},
       Id: ${id}`
      );
    console.log('<------------------------------ENDE------------------------------------>');
    this.filteredVehicles = [];

    this.filteredVehicles = this.vehiclesCategorized.filter(vehicle =>
        (brandsToSelect.includes(vehicle.marke) || brandsToSelect.length === 0) &&
        (!manDate || vehicle.baujahr >= manDate) &&
        (!id || vehicle.id == id)
      );
    
    this.filteredVehicles = [...this.filteredVehicles]; // Erzeugt eine neue Referenz

    console.log('Filtered Vehicles:', this.filteredVehicles);
  }

  searchVehicle() {
    const search = this.categoryForm.value['search'];
    this.filteredVehicles = [];
    console.log('Search:', search.replace(' ', '').toLowerCase());
    if(search == undefined || search == '') {
      this.filteredVehicles = this.vehiclesCategorized;
      return
    }
    this.vehiclesCategorized.forEach((vehicle) => {
      let str = this.vehicleToString(vehicle);
      if(search && str.includes(search.replace(' ', ''))) {
        this.filteredVehicles.push(vehicle);
      }
    });
  }
  
  toggleFilters() {
    this.isVisible = !this.isVisible;
  }

  goToDetail(id : number) {
    this.router.navigate(['vehicle-detail', id]);
  }

  reset() {
    this.filteredVehicles = this.vehiclesCategorized;
  }

  updateCategory(){
    console.log('Category motorcycle:', this.categoryForm.value['category_motorcycle']);
    console.log('Category cars:', this.categoryForm.value['category_car']);
    this.vehiclesCategorized = [];
    this.vehicles.forEach((vehicle) => {
      if (this.categoryForm.value['category_motorcycle'] && !this.categoryForm.value['category_car']){
        if(vehicle.category == 'motorcycle'){
          this.vehiclesCategorized.push(vehicle);
        }
      } else if(!this.categoryForm.value['category_motorcycle'] && this.categoryForm.value['category_car']){
        if(vehicle.category == 'car'){
          this.vehiclesCategorized.push(vehicle);
        }
      } else {
        this.vehiclesCategorized.push(vehicle);
      }
    });
    this.filteredVehicles = this.vehiclesCategorized;
    this.fillFilterArrays();
    this.onSubmit();
    console.log('Vehicles Categorized:', this.vehiclesCategorized);
  }
  
  vehicleToString(vehicle : any) {
  	let str = '';
    for (const key in vehicle) {
      str += `${vehicle[key as keyof typeof vehicle]}`;
    }
    
    return str.toLowerCase();   
  }
}
  

