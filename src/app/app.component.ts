import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HabenWollen';
  emptyUser: User = new User( '', '', '', '', 0);
  currentUser: User = this.emptyUser;
  isLoggedIn = false;
  
  constructor(private authService: AuthService, private router: Router) {
    if (this.authService.isAuthenticated()) {
      this.setCurrentUser();
    }
  }

  public setCurrentUser(): User {
    this.authService.getProtectedData().subscribe(
      (data) => {

        this.currentUser = new User(data.user.username, data.user.password, data.user.email, data.user.image, data.user.id); 
        console.log('Daten empfangen:', data);
      },
      (error) => {
        console.error('Fehler:', error);
      }
    );
    this.isLoggedIn = true;
    return this.currentUser;
  }
  
  public getCurrentUser(): User {
    if (this.authService.isAuthenticated() && !this.isLoggedIn) {
      return this.setCurrentUser()
    }
    return this.currentUser;
  }
  
  public onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = this.emptyUser;
    this.router.navigate(['']);
  }
}

export class User {
  constructor(
    private name: string,
    private password: string,
    private email: string,
    private image: string,
    private id: number
  ) {}

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getPassword(): string {
    return this.password;
  }

  public setPassword(password: string): void {
    this.password = password;
  }

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getImage(): string {
    if (this.image === null) {
      return '../assets/images/user.jpg';
    } else {
      return this.image;
    }
  }

  public setImage(image: string): void {
    this.image = image;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
  }
}