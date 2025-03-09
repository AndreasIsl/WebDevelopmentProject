import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormBuilder, FormGroup,Validators, FormsModule, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { AppComponent, User } from '../app.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
profileEditForm: FormGroup;
user: User = new User( '', '',  '', '', 0 );
userItems: any = [];
editing: any;
submitButtonDisabled = true;

  
  
  constructor(private fb: FormBuilder,private appComponent: AppComponent, private authService: AuthService, private router: Router) {
     this.profileEditForm = this.fb.group({
          username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
          email: ['', [Validators.required, Validators.email]],
          password: ['', [Validators.required, Validators.minLength(8), passwordValidator]],
          confirmPassword: ['', Validators.required]
        }, { validators: confirmPasswordValidator });
  }
  
  get passwordErrors(): { [key: string]: any } {
    return this.profileEditForm.get('password')?.errors || {};
  }

  get profileEditFormErrors() {
    return this.profileEditForm.errors;
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      this.authService.getProtectedData().subscribe(
        (data) => {
          this.user = new User(data.user.username, data.user.password, data.user.email, data.user.image, data.user.id); 
          console.log('Loaded user data in Profile:', data);
          this.getItems();
        
        },
        (error) => {
          console.error('Fehler:', error);
        }
      );
    } else {
      this.router.navigate(['']);
    }
  }
  
  async getItems() {
    try {
      const response = await fetch("http://localhost:5001/vehicles/creatorid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: this.user.getId() }), // Hier getId als Funktion aufrufen
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json(); // JSON aus der Response parsen
      console.log("Antwort:", data[0]);
      this.userItems = data;
      this.setPlaceholderImage();
    } catch (error) {
      console.error("Fehler:", error);
    }
  }
  
  
  deleteItem(id : number) {
    const deleteData = async () => {
      const response = await fetch(`http://localhost:5001/vehicles/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        console.log(`Vehicle with id: ${id} deleted`);
        this.router.navigate(['profil']); 
      } else {
        console.error("Error deleting vehicle");
      }
    };
    
    deleteData();
  }

  onSubmit() {
    const updateData = async () => {
      const response = await fetch("http://localhost:5001/auth/update", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: this.profileEditForm.value['username'],
            email: this.profileEditForm.value['email'],
            password: this.profileEditForm.value['password'],
            id: this.user.getId()
          }),        
        });
        
      this.appComponent.onLogout(); 
      if (response.ok) {
        console.log(`User updated`);
        this.editing = false;
      } else {
        console.error("Error deleting vehicle");
      }
    };
    
    
    updateData();
  }
  
  editProfile() {
    this.profileEditForm.patchValue({ username: this.user.getName() });
    this.profileEditForm.patchValue({ password: this.user.getPassword() });
    this.profileEditForm.patchValue({ email: this.user.getEmail() });

    this.editing = true;
  }

  setPlaceholderImage() {
    this.userItems.forEach((item : any) => {
      if (item.bilder == null || item.bilder.length == 0) {
        item.Image = '../assets/images/car_placeholder_image.png';
      } else {
        item.Image = item.bilder[0];
      }
    })
  }

  goToDetail(id : number) {
    this.router.navigate(['vehicle-detail', id]);
  }

  
}

export function confirmPasswordValidator(group: AbstractControl): ValidationErrors | null {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (password !== confirmPassword) {
    return { passwordMismatch: 'Passwörter stimmen nicht überein' };
  }
  return null;
}

export function passwordValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;

  if (!value) {
    return null; 
  }

  // Bedingungen prüfen
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  const passwordValid = hasUpperCase && hasNumber;

  return !passwordValid ? { passwordStrength: 'Das Passwort muss mindestens einen Großbuchstaben und eine Zahl enthalten' } : null;
}
