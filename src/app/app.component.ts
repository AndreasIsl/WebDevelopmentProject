import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

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
  
  public setCurrentUser(user: User): void {
    this.currentUser = user;
    this.isLoggedIn = true;
  }
  
  public getCurrentUser(): User | null {
    return this.currentUser;
  }
  
  public onLogout() {
    this.isLoggedIn = false;
    this.currentUser = null;
  }
  
  public async onLogin(UserName: any, Password: any) {
    const isUserValid = await this.loadUser(UserName, Password);
    if (isUserValid) {
      console.log('Login successfull!');
    } else {
      console.error('Login failed!');
    }
  }
  
  private async loadUser(UserName: any, Password: any) {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5000/authen/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserName: UserName , Password: Password}),
      }).then(async (response) => {
        
        if (response.ok) {
          const data = await response.json();
          this.setCurrentUser(new User(UserName, Password, data.email, data.image));

          resolve(true);
        } else {
          resolve(false);
        }
      }).catch((err) => {
        resolve(false);
      });
    })
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