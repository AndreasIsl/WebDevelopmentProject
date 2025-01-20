import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiService } from '../api.service';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent, User } from '../app.component';




@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [ApiService]
})
export class LoginComponent {
  registerForm: FormGroup;
  @ViewChild('notUniqueUserAlert') notUniqueUserAlert!: ElementRef<HTMLParagraphElement>;


  constructor(private fb: FormBuilder, private apiService: ApiService, private router: Router, private appComponent: AppComponent) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  async onSubmit() {
    const userData = {
      UserName: this.registerForm.value.userName,
      Password: this.registerForm.value.password,
    };

    const isUserValid = await this.loginCheck(userData.UserName, userData.Password);

    if (this.registerForm.valid && isUserValid) {
      // const user = new User(userData.UserName, userData.Password, userData.Email, '');
      // this.appComponent.setCurrentUser(user);
      console.log('Form Submitted!');
      this.router.navigate(['']);
    } else {

    }

  }

  loginCheck(username: string, password:string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      fetch('http://localhost:5000/authen/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ UserName: username , Password: password}),
      }).then(async (response) => {
        console.log(`Error: ${response.body}`);
        const data = await response.json();

        // if (!response.ok) {
        //   console.error('Error: User already exists');
        //   this.notUniqueUserAlert.nativeElement.style.display = 'block';
        //   resolve(false);
        // } else {
        //   console.log(`Error: ${response.body}`);
        //   resolve(true);
        // }
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

