import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors, FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { AppComponent, User } from '../app.component';




@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [ApiService]
})
export class LoginComponent {
  loginForm: FormGroup;
  @ViewChild('notUniqueUserAlert') notUniqueUserAlert!: ElementRef<HTMLParagraphElement>;


  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private appComponent: AppComponent) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    const userData = {
      UserName: this.loginForm.value.userName,
      Password: this.loginForm.value.password,
    };
    const isUserValid = await this.loginCheck(userData.UserName, userData.Password);

    if (this.loginForm.valid && isUserValid) {
      this.appComponent.onLogin(userData.UserName, userData.Password);
      this.router.navigate(['']);
    } else {

    }

  }

  loginCheck(username: string, password: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fetch(`http://localhost:5000/authen/user/login?UserName=${username}&Password=${password}`, {
        method: 'GET',
      }).then(async (response) => {
        if (!response.ok) {
          console.error('Error: User already exists');
          this.notUniqueUserAlert.nativeElement.style.display = 'block';
          resolve(false);
        } else {
          console.log(`Login data matches user`);
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

