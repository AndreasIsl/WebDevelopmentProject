import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { AppComponent, User } from '../app.component';
import { AuthService } from '../services/auth.service';
import { log } from 'console';




@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: []
})
export class LoginComponent {
  loginForm: FormGroup;
  @ViewChild('notUniqueUserAlert') notUniqueUserAlert!: ElementRef<HTMLParagraphElement>;
  errorMessage!: string;


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private appComponent: AppComponent) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    const { username, password } = this.loginForm.value;
    this.authService.login(username, password).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.token);

        this.appComponent.setCurrentUser();
        this.router.navigate(['']);
        console.log('Login successfull!');
      },
      (err: any) => {
        this.errorMessage = 'Login failed!';
      }
    )
  }
}

