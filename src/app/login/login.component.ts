import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
;

@Component({
  selector: 'app-login',
  imports: [RouterLink,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  onSubmit(form: any) {
    if (form.valid) {
      console.log('Form Submitted!', form.value);
    }
  }
}
