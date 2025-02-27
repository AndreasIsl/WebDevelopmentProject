import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent, User } from '../app.component';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-register',
  imports: [RouterLink, CommonModule, NgIf, FormsModule, ReactiveFormsModule, HttpClientModule,],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  providers: []
})
export class RegisterComponent {
  registerForm: FormGroup;
  @ViewChild('notUniqueUserAlert') notUniqueUserAlert!: ElementRef<HTMLParagraphElement>;
  errorMessage!: string;
  successMessage: string = '';



  get passwordErrors(): { [key: string]: any } {
    return this.registerForm.get('password')?.errors || {};
  }

  constructor(private fb: FormBuilder, private router: Router, private appComponent: AppComponent,private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), passwordValidator]],
      confirmPassword: ['', Validators.required]
    }, { validators: confirmPasswordValidator });
  }

  get registerFormErrors() {
    return this.registerForm.errors;
  }

  async onSubmit() {
    const { username, password, email } = this.registerForm.value;
      this.authService.register(username, password, email).subscribe(
        (res: any) => {
          this.successMessage = 'Register success!';
          localStorage.setItem('token', res.token); 
          this.appComponent.setCurrentUser();
          this.router.navigate(['']);
        },
        (err: any) => {
          this.errorMessage = 'Register failed.';
        }
      );  
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