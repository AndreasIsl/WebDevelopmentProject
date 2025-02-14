import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
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
  currentUser: User | null = null;
  isLoggedIn = false;
  
constructor(private authService: AuthService) {
}

  public setCurrentUser(): void {
    this.authService.getProtectedData().subscribe(
      (data) => {
        this.currentUser = data;  // Die Antwort speichern
        console.log('Daten empfangen:', data);
      },
      (error) => {
        console.error('Fehler:', error);
      }
    );
    this.isLoggedIn = true;
  }
  
  public getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  public onLogout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.currentUser = null;
  }
}

export class User {
  constructor(
    private name: string,
    private password: string,
    private email: string,
    private image: string
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
    return this.image;
  }

  public setImage(image: string): void {
    this.image = image;
  }
}