import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppComponent } from '../../app.component';
import { passwordValidator, confirmPasswordValidator } from '../../register/register.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-listing',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './vehicle-listing.component.html',
  styleUrl: './vehicle-listing.component.css'
})
export class VehicleListingComponent {
  vehicleListingForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private appComponent: AppComponent, private authService: AuthService) {
    this.vehicleListingForm = this.fb.group({
      brand: ['', [Validators.required]],
      model: ['', [Validators.required]],
      manufactoringDate: ['', [Validators.required]],
      mileage: ['', Validators.required],
      price: ['', Validators.required]
    }, { validators: confirmPasswordValidator });
  }
  
  onSubmit() {
    const insertVehicle = async ()=>{
      try {
        const { brand,model,manufactoringDate,mileage,price } = this.vehicleListingForm.value;
        const response = await fetch("http://localhost:5001/vehicles/newvehicle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            brand: brand,
            model: model,
            manufactoringDate: manufactoringDate,
            mileage: mileage,
            price: price,
            creatorID: this.appComponent.currentUser.getId 
          }),        
        });
    
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        this.router.navigate(['']);
      } catch (error) {
        console.error("Fehler:", error);
      }
    }

    insertVehicle();
  }
}
