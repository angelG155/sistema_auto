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

  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/add', component: CarFormComponent },
  { path: 'dashboard/edit/:id', component: CarFormComponent },
  { path: '**', redirectTo: '' }

];
