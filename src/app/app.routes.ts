import { Routes } from '@angular/router';
import { authGuard } from './pages/auth/service/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/car/car.component').then(m => m.CarComponent),
    canActivate: [authGuard],
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
