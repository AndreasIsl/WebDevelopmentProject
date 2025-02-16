import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-vehicle-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.css'
})
export class VehicleDetailComponent implements OnInit {
  vehicleId: number | null = null;
  vehicle: any = {};

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Fahrzeug-ID:', this.vehicleId);
    this.getVehicle();
  }

  async getVehicle() {
    try {
      console.log('Fahrzeug-ID:', this.vehicleId);
      const response = await fetch('http://localhost:5000/vehicle', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: this.vehicleId })
      });
    
      let data = await response.json();
      this.vehicle = data[0];
      console.log('Fahrzeug:', this.vehicle); 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      this.setPlaceholderImage();
      this.trimManuDate();
    } catch (err) {
      console.error(err);
    }
  }
  trimManuDate() {
    // this.vehicle.erstelllt_am = this.vehicle.erstelllt_am.substring(0, 10);
  }

  setPlaceholderImage() {
    if (this.vehicle.bilder.length == 0) {
      this.vehicle.Image = '../assets/images/car_placeholder_image.png';
    } else {
      this.vehicle.Image = this.vehicle.bilder[0];
    }
  }
}
