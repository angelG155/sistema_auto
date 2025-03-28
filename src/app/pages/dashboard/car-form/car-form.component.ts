import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CarService, Car } from '../../../services/car.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-car-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './car-form.component.html',
  styleUrls: ['./car-form.component.css']
})
export class CarFormComponent implements OnInit {
  carForm: FormGroup;
  editingCar: boolean = false;
  isSidebarOpen: boolean = false;
  caracteristicas: string[] = [];
  textCaracter: string = '';

  tiposCarroceria = ['sedan', 'suv', 'hatchback', 'pickup', 'van', 'coupe', 'wagon', 'convertible', 'truck'];

  constructor(
    private carService: CarService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const today = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD

    this.carForm = this.fb.group({
      nombre: ['', Validators.required],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anio: ['', Validators.required],
      tipoCarroceria: ['', [Validators.required, Validators.pattern('^(sedan|suv|hatchback|pickup|van|coupe|wagon|convertible|truck)$')]],
      color: ['', Validators.required],
      placas: ['', Validators.required],
      estado: ['', Validators.required],
      descripcion: ['', Validators.required],
      precio: ['', Validators.required],
      imagenUrlCompleta: ['', Validators.required],
      ulimoServicio: [today, Validators.required],
    });
  }

  ngOnInit(): void {
    // Obtener el ID del auto si estamos en modo edición
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.editingCar = true;
        // Aquí iría la lógica para cargar los datos del auto
        // this.carService.getCar(params['id']).subscribe(car => {
        //   this.carForm.patchValue(car);
        //   this.caracteristicas = car.caracteristicas;
        // });
      }
    });
  }

  addCharacteristics(text: string) {
    if (text && text.trim() !== '') {
      this.caracteristicas.push(text.trim());
      this.textCaracter = '';
    }
  }

  deleteCharacteristics(index: number) {
    this.caracteristicas.splice(index, 1);
  }

  onSubmit(): void {
    if (this.carForm.valid) {
      const carData = {
        ...this.carForm.value,
        caracteristicas: this.caracteristicas
      };

      if (this.editingCar) {
        // Lógica para actualizar
      } else {
        // Lógica para crear
      }
    }
  }

  resetForm(): void {
    this.editingCar = false;
    this.carForm.reset();
  }

  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebarOnMobile() {
    if (window.innerWidth < 768) { // 768px es el breakpoint md de Tailwind
      this.isSidebarOpen = false;
    }
  }
}
