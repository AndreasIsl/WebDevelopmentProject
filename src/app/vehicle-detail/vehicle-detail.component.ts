import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppComponent } from '../app.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { stat } from 'fs';

@Component({
  selector: 'app-vehicle-detail',
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, NgIf],
  templateUrl: './vehicle-detail.component.html',
  styleUrl: './vehicle-detail.component.css'
})
export class VehicleDetailComponent implements OnInit {
  vehicleEditForm: FormGroup;
  vehicleId: number | null = null;
  vehicle: any = {};
  onEditVal = false;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private appComponent: AppComponent,private router: Router) {
    this.vehicleEditForm = this.fb.group({
      brand: [''],
      model: [''],
      manufacturingdate: [''],
      mileage: [''],
      price: [''],
      description: [''],
      selstatus: ['']
    });
  }

  ngOnInit(): void {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Fahrzeug-ID:', this.vehicleId);
    this.getVehicle();
  }

  async getVehicle() {
    try {
      const response = await fetch('http://localhost:5001/vehicle', {
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
    } catch (err) {
      console.error(err);
    }
  }


  setPlaceholderImage() {
    if (this.vehicle.bilder == null || this.vehicle.bilder.length == 0) {
      this.vehicle.Image = '../assets/images/car_placeholder_image.png';
    } else {
      this.vehicle.Image = this.vehicle.bilder[0];
    }
  }

  onEdit() {
    this.vehicleEditForm.patchValue({ price: this.vehicle.preis });
    this.vehicleEditForm.patchValue({ mileage: this.vehicle.kilometerstand });
    this.vehicleEditForm.patchValue({ manufacturingdate: this.vehicle.baujahr });
    this.vehicleEditForm.patchValue({ description: this.vehicle.beschreibung });
    this.vehicleEditForm.patchValue({ selstatus: this.vehicle.status });
    

    this.onEditVal = true;
  }

  onSubmit() {
    const updateData = async () => {
      const response = await fetch("http://localhost:5001/vehicle/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: this.vehicleEditForm.value['price'],
          mileage: this.vehicleEditForm.value['mileage'],
          manufacturingdate: this.vehicleEditForm.value['manufacturingdate'],
          description: this.vehicleEditForm.value['description'],
          id: this.vehicle.id,
          status: this.vehicleEditForm.value['selstatus']
        }),
      });


      if (response.ok) {
        console.log(`Vehicle updated`);
        await this.getVehicle();
        this.onEditVal = false;
      } else {
        console.error("Error updating vehicle");
      }
    };

    updateData();
  }

  isOwner() {
    return this.vehicle.ersteller_id == this.appComponent.getCurrentUser().getId();
  }

  onContact() {
    this.router.navigate(['messages', this.vehicle.ersteller_id])
  }


}
