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
    throw new Error('Method not implemented.');
  }
}
