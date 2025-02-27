import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent, User } from '../app.component';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  
  user: User = new User( '', '',  '', '', 0 );
  userItems: any = [];
  
  
  constructor(private appComponent: AppComponent, private authService: AuthService, private router: Router) {
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
        this.router.navigate(['profil']); // Jetzt funktioniert `this.router`
      } else {
        console.error("Error deleting vehicle");
      }
    };
  
    deleteData();
    
  }
  
  editProfile() {
  throw new Error('Method not implemented.');
  }

  setPlaceholderImage() {
    this.userItems.forEach((item : any) => {
      if (item.bilder.length == 0) {
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
