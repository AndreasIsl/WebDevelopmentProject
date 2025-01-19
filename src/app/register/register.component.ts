import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent, User } from '../app.component';
import { template } from 'lodash';







@Component({
  selector: 'app-register',
  imports: [RouterLink, CommonModule, NgIf, FormsModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [ApiService]
})
export class RegisterComponent {
  registerForm: FormGroup;
  @ViewChild('notUniqueUserAlert') notUniqueUserAlert!: ElementRef<HTMLParagraphElement>;


  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private appComponent: AppComponent) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: confirmPasswordValidator });
  }

  get passwordErrors() {
    return this.registerForm.get('password')?.errors;
  }

  get registerFormErrors() {
    return this.registerForm.errors;
  }

  async onSubmit() {
    const userData = {
      UserName: this.registerForm.value.userName,
      Password: this.registerForm.value.password,
      Email: this.registerForm.value.email
    };

    const isUserValid = await this.checkIfUserExists(userData.UserName);

    if (this.registerForm.valid && isUserValid) {
      this.apiService.addItem(userData).subscribe({
        next: (response) => {
          console.log('Form Submitted! API Response:', response);
          const user = new User(userData.UserName, userData.Password, userData.Email, '');
          this.appComponent.setCurrentUser(user);
          this.router.navigate(['']);
        },
        error: (err) => {
          console.error('Fehler bei der API-Anfrage:', err);
        }
      });
    } else {
      console.error('Error: Register didnt work');
    }
  }

  checkIfUserExists(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5000/authen/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserName: username }),
      }).then(async (response) => {
        if (!response.ok) {
          console.error('Error: User already exists');
          this.notUniqueUserAlert.nativeElement.style.display = 'block';
          resolve(false);
        } else {
          console.log('Log: No Error   found valid user');
          resolve(true);
        }
      }).catch((err) => {
        console.error('Network error:', err);
        alert('Failed to communicate with the server');
        resolve(false);
      });
    })
  }

  closeAlert() {
    if (this.notUniqueUserAlert) {
      this.notUniqueUserAlert.nativeElement.style.display = 'none';
    } else {
      console.error('Element not found: notUniqueUserAlert');
    }
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
    return null; // Kein Fehler, wenn das Feld leer ist (für Required separat prüfen)
  }

  // Bedingungen prüfen
  const hasUpperCase = /[A-Z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  const passwordValid = hasUpperCase && hasNumber;

  return !passwordValid ? { passwordStrength: 'Das Passwort muss mindestens einen Großbuchstaben und eine Zahl enthalten' } : null;
}