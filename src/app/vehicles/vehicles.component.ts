import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-vehicles',
  imports: [NgIf, CommonModule],
  templateUrl: './vehicles.component.html',
  styleUrl: './vehicles.component.css'
})
export class VehiclesComponent {
  isVisible = false;
  vehicles: any[] = [];

  constructor() {
    this.getVehicles();
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
      const response = await fetch('http://localhost:5000/vehicles');
      const data = await response.json();
      this.vehicles = data;

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      console.log(data);

      this.setPlaceholderImage();
    } catch (err) {
      console.error(err);
    }
  }

  searchVehicle() {
    throw new Error('Method not implemented.');
  }
  toggleFilters() {
    this.isVisible = !this.isVisible;
  }

}
