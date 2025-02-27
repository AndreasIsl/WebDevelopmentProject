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
  filterForm: FormGroup;
  isVisible = false;
  vehicles: any[] = [];
  brands: string[] = [];
  manufactoringDates: number[] = [];
  ids: number[] = [];

  constructor(private fb: FormBuilder,private cd: ChangeDetectorRef,private router: Router) {
    this.getVehicles();
    this.filterForm = this.fb.group({
      Ids:[''],
      manufactoringDate:['']
    }, {});
  }

  setPlaceholderImage() {
    this.vehicles.forEach((vehicle) => {
      if (vehicle.bilder.length == 0) {
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

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(data);

      this.setPlaceholderImage();
      this.fillFilterArrays();
    } catch (err) {
      console.error(err);
    }
  }


  
  fillFilterArrays() {
    this.vehicles.forEach((vehicle) => {
      if (this.brands.length <= 10) {
        this.brands.push(vehicle.marke);
        this.manufactoringDates.push(vehicle.baujahr);
        this.ids.push(vehicle.id);
        this.filterForm.addControl(vehicle.marke.toString(), this.fb.control(false));
      } else {
        return;
      }
    });
    console.log('Dates:', this.manufactoringDates);
    this.manufactoringDates.sort((a, b) => a - b);
    console.log('Dates:', this.manufactoringDates);
    this.cd.detectChanges();
  }

  onSubmit() {
    const { brand, manufactoringDate, id } = this.filterForm.value;
    console.log(`Brand: ${brand}, Manufactoring Date: ${manufactoringDate}, Id: ${id}`);

  }

  searchVehicle() {
    throw new Error('Method not implemented.');
  }
  toggleFilters() {
    this.isVisible = !this.isVisible;
  }

  goToDetail(id : number) {
    this.router.navigate(['vehicle-detail', id]);
  }
}
