import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpClientModule } from '@angular/common/http';






@Component({
  selector: 'app-register',
  imports: [ RouterLink, CommonModule, NgIf, FormsModule, ReactiveFormsModule,HttpClientModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: [ApiService]
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder , private apiService: ApiService) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8),passwordValidator]],
      confirmPassword: ['', Validators.required]
    },{ validators: confirmPasswordValidator });
  }
 
  get passwordErrors() {
    return this.registerForm.get('password')?.errors;
  }
  
  get registerFormErrors() {
    return this.registerForm.errors;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = {
        UserName: this.registerForm.value.userName,
        Password: this.registerForm.value.password,
        Email: this.registerForm.value.email
      };
  
      // API-Anfrage ausführen und korrekt behandeln
      this.apiService.addItem(userData).subscribe({
        next: (response) => {
          console.log('Form Submitted! API Response:', response);
          // Hier kannst du weitere Logik einfügen, z. B. Navigation
        },
        error: (err) => {
          console.error('Fehler bei der API-Anfrage:', err);
          // Zeige eventuell eine Fehlermeldung im UI an
        }
      });
    } else {
      console.log('Form is invalid');
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