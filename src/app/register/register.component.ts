import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';




@Component({
  selector: 'app-register',
  imports: [ RouterLink, CommonModule, NgIf, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
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
      console.log('Form Submitted!', this.registerForm.value);
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