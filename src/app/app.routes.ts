import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { RealEstateComponent } from './real-estate/real-estate.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';


export const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    { 
        path: 'vehicles', 
        component: VehiclesComponent 
    },
    { 
        path: 'real-estate', 
        component: RealEstateComponent
    },
    { 
        path: 'login', 
        component: LoginComponent 
    },
    { 
        path: 'register',
         component: RegisterComponent
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }