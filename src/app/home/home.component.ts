import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  slideRight() {
    throw new Error('Method not implemented.');
  }
  slideLeft() {
    throw new Error('Method not implemented.');
  }
  vehicles: any[] = [];
  real_estate: any[] = [];
  
  constructor(private router: Router) {
    this.getVehicles();
    // this.getRealEstate();
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
    } catch (err) {
      console.error(err);
    }
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
  
  async getRealEstate() {
  }

  goToDetail(id : number) {
    this.router.navigate(['vehicle-detail', id]);
  }
}
