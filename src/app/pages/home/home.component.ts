import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeService } from './service/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;

  constructor(private homeService: HomeService) { }

  cars:any = [];

  ngOnInit() {
    this.homeService.getCars().subscribe((cars: any) => {
      this.cars = cars;
    });
  }

  ngAfterViewInit() {
    if (typeof window !== 'undefined') {
      this.cardElements.forEach(cardRef => {
        const card = cardRef.nativeElement;
        card.addEventListener('mousemove', (e: MouseEvent) => this.handleHover(e, card));
        card.addEventListener('mouseleave', (e: MouseEvent) => this.resetCard(e, card));
      });
    }
  }

  contact() {
    alert('¡Gracias por elegir WJ Sales! Por favor llama al +(308)-389-1551 para asistencia inmediata.');
  }

  onWhatsAppClick(car: any, event: Event) {
    event.preventDefault();
    const phone = '13083891551';
    const message = `Hola William, me interesa el ${car.name} que vi en su página web con precio de ${car.price}. ¿Podría darme más información?`;
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(whatsappUrl, '_blank');
    }
  }

  private handleHover(e: MouseEvent, card: HTMLElement) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    card.style.transition = 'transform 0.1s';

    this.updateShineEffect(card, x, y, rect.width, rect.height);
  }

  private resetCard(e: MouseEvent, card: HTMLElement) {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s';

    const shine = card.querySelector('.shine');
    if (shine) {
      shine.remove();
    }
  }

  private updateShineEffect(card: HTMLElement, x: number, y: number, width: number, height: number) {
    let shine = card.querySelector('.shine') as HTMLElement;

    if (!shine) {
      shine = document.createElement('div');
      shine.className = 'shine';
      shine.style.position = 'absolute';
      shine.style.top = '0';
      shine.style.left = '0';
      shine.style.right = '0';
      shine.style.bottom = '0';
      shine.style.background = 'linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)';
      shine.style.pointerEvents = 'none';
      shine.style.opacity = '0.6';
      card.appendChild(shine);
    }

    const moveX = ((x / width) * 200) - 100;
    const moveY = ((y / height) * 200) - 100;
    shine.style.transform = `translate(${moveX}%, ${moveY}%) rotate(45deg)`;
  }
}
