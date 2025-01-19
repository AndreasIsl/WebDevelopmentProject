import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,RouterLink,RouterLinkActive,CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HabenWollen';
  currentUser: User | null = null;
  isLoggedIn: Boolean = false;


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