import { Routes } from '@angular/router';
import { authGuard } from './pages/auth/service/auth.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CarFormComponent } from './pages/dashboard/car-form/car-form.component';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/car/car.component').then(m => m.CarComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/car/list-car/list-car.component' ).then(m => m.ListCarComponent),
      },
      {
        path: 'create',
        loadComponent: () => import('./pages/dashboard/car/create-car/create-car.component' ).then(m => m.CreateCarComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () => import('./pages/dashboard/car/edite-car/edite-car.component' ).then(m => m.EditeCarComponent),
      },
    ]
  },



];
