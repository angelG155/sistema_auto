import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from './service/home.service';
import { CarService, Car } from '../../services/car.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;

  cars: Car[] = [];
  cartopsales: number = 0;
  phone: string = '13083891551';
  selectedCar: Car | null = null;
  showModal = false;
  isSidebarOpen = false;

  currentIndex = 0;
  isAutoPlaying = true;
  private intervalId: any;

  constructor(private homeService: HomeService) { }

  ngOnInit() {
    this.homeService.getCars().subscribe((cars: any) => {
      this.cars = cars;
      this.cartopsales = this.cars.filter(car => car.top_sales).length;
    });
  }

  getSlideStyle(index: number): any {
    const offset = index - this.currentIndex;
    const isActive = index === this.currentIndex;

    return {
      transform: `
        translate(-50%, -50%)
        translateX(${offset * 70}%)
        translateZ(${isActive ? 0 : -500}px)
        rotateY(${offset * 45}deg)
        scale(${isActive ? 1 : 0.8})
      `,
      opacity: isActive ? 1 : 0.6,
      zIndex: isActive ? 1 : 0
    };
  }

  goToSlide(index: number): void {
    this.currentIndex = index;
  }

  goToPrevious(): void {
    this.currentIndex = (this.currentIndex - 1 + this.cartopsales) % this.cartopsales;
  }

  goToNext(): void {
    this.currentIndex = (this.currentIndex + 1) % this.cartopsales;
  }

  setIsAutoPlaying(value: boolean): void {
    this.isAutoPlaying = value;
    if (value) {
      this.startAutoPlay();
    } else {
      this.stopAutoPlay();
    }
  }

  private startAutoPlay(): void {
    if (this.isAutoPlaying) {
      this.intervalId = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.cartopsales;
      }, 5000);
    }
  }

  private stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  openCarModal(car: Car) {
    this.selectedCar = car;
    this.showModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.showModal = false;
    this.selectedCar = null;
    document.body.style.overflow = 'auto';
  }

  onWhatsAppClick(car: Car, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    const phone = this.phone;
    const message = `Hola William, me interesa el ${car.nombre} que vi en su página web con precio de ${car.precio}. ¿Podría darme más información?`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  }

  formatNumber(number: number): string {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    if (this.isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

}
