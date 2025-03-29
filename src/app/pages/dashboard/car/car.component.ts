import { Component } from '@angular/core';
import { CarService } from '../../../services/car.service';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-car',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './car.component.html',
  styleUrl: './car.component.css'
})
export class CarComponent {

}
