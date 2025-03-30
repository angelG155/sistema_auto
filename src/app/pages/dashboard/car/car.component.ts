import { Component } from '@angular/core';
import { CarService } from '../../../services/car.service';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent {
  isSidebarOpen = false;

  constructor(private router: Router, private authService: AuthService) {}

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile(): void {
    if (window.innerWidth < 768) { // 768px es el breakpoint md de Tailwind
      this.isSidebarOpen = false;
    }
  }

  goToList(): void {
    this.router.navigate(['/dashboard']);
  }

  goToAdd(): void {
    this.router.navigate(['/dashboard/create']);
  }

  logout(): void {
    this.authService.logout();
  }
}
