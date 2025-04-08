import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CarService, Car } from '../../../../services/car.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edite-car',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './edite-car.component.html',
  styleUrl: './edite-car.component.css'
})
export class EditeCarComponent implements OnInit {
  id: number = 0;
  nombre: string = '';
  marca: string = '';
  modelo: string = '';
  anio: number = 0;
  carroceria: string = '';
  color: string = '';
  placas: string = '';
  descripcion: string = '';
  precio: number = 0;
  millas: number = 0;
  caracteristicas: string[] = [];
  imagenUrl: string = '';
  tiposCarroceria = ['sedan', 'suv', 'hatchback', 'pickup', 'van', 'coupe', 'wagon', 'convertible', 'truck'];
  selectedFile: File | null = null;
  textCaracter: string = '';
  maxYear = new Date().getFullYear();

  constructor(
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private carService: CarService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = params['id'];
    });

    this.carService.getCar(this.id).subscribe(car => {
      this.nombre = car.nombre;
      this.marca = car.marca;
      this.modelo = car.modelo;
      this.anio = car.anio;
      this.carroceria = car.tipoCarroceria;
      this.color = car.color;
      this.placas = car.placas;
      this.descripcion = car.descripcion;
      this.precio = parseFloat(car.precio);
      this.millas = car.millas;
      this.imagenUrl = car.imagenUrlCompleta;
      this.caracteristicas = car.caracteristicas;
    });
  }

  validateFields(): boolean {
    if (!this.nombre || this.nombre.length > 80) {
      this.toastr.error('El nombre es requerido y no debe exceder 80 caracteres');
      return false;
    }
    if (!this.marca || this.marca.length > 80) {
      this.toastr.error('La marca es requerida y no debe exceder 80 caracteres');
      return false;
    }
    if (!this.modelo || this.modelo.length > 80) {
      this.toastr.error('El modelo es requerido y no debe exceder 80 caracteres');
      return false;
    }
    if (!this.anio || this.anio < 1900 || this.anio > new Date().getFullYear()) {
      this.toastr.error('El año debe estar entre 1900 y el año actual');
      return false;
    }
    if (!this.carroceria) {
      this.toastr.error('El tipo de carrocería es requerido');
      return false;
    }
    if (!this.color || this.color.length > 20) {
      this.toastr.error('El color es requerido y no debe exceder 20 caracteres');
      return false;
    }
    if (!this.placas || this.placas.length > 20) {
      this.toastr.error('Las placas son requeridas y no deben exceder 20 caracteres');
      return false;
    }
    if (!this.descripcion || this.descripcion.length < 30 || this.descripcion.length > 1000) {
      this.toastr.error('La descripción debe tener entre 30 y 1000 caracteres');
      return false;
    }
    if (!this.millas || this.millas < 0) {
      this.toastr.error('El millaje debe ser mayor a 0');
      return false;
    }
    if (!this.precio || this.precio <= 0 || this.precio > 1000000) {
      this.toastr.error('El precio debe estar entre 0 y 1,000,000');
      return false;
    }
    if (this.caracteristicas.length === 0) {
      this.toastr.error('Debe agregar al menos una característica');
      return false;
    }
    return true;
  }

  addCharacteristics(text: string) {
    if (text && text.trim() !== '') {
      this.caracteristicas.push(text.trim());
      this.textCaracter = '';
    } else {
      this.toastr.info('El campo no puede estar vacío');
    }
  }

  capturarFile(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Verificar que el archivo sea de tipo imagen permitido
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
      if (!tiposPermitidos.includes(file.type)) {
        this.toastr.error('Solo se permiten archivos de imagen en formato JPEG, PNG o WebP.');
        this.selectedFile = null;
        return;
      }

      // Verificar tamaño máximo (5MB)
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.toastr.error(`El tamaño del archivo no debe exceder los ${maxSizeInMB} MB.`);
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
    }
  }

  deleteCharacteristics(index: number): void {
    this.caracteristicas.splice(index, 1);
  }

  updateCar(): void {
    if (!this.validateFields()) {
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('marca', this.marca);
    formData.append('modelo', this.modelo);
    formData.append('anio', this.anio.toString());
    formData.append('tipoCarroceria', this.carroceria);
    formData.append('color', this.color);
    formData.append('placas', this.placas);
    formData.append('estado', 'Disponible');
    formData.append('descripcion', this.descripcion);
    formData.append('precio', this.precio.toString());
    formData.append('millas', this.millas.toString());

    this.caracteristicas.forEach((caracteristica, index) => {
      formData.append(`caracteristicas[${index}]`, caracteristica);
    });

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.carService.updateCar(this.id, formData).subscribe({
      next: (response) => {
        this.toastr.success('Automóvil actualizado correctamente');
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.toastr.error('Error al actualizar el automóvil: ' + error.error.error);
        console.error('Error:', error);
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/dashboard']);
  }
}
