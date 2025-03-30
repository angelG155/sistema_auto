import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { CarService, Car } from '../../../../services/car.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

interface CarData {
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  tipoCarroceria: string;
  color: string;
  placas: string;
  estado: string;
  descripcion: string;
  precio: number;
  caracteristicas: string[];
  [key: string]: any; // Esto permite indexación con strings
}

@Component({
  selector: 'app-create-car',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-car.component.html',
  styleUrl: './create-car.component.css'
})
export class CreateCarComponent {

  carForm: FormGroup;
  editingCar: boolean = false;
  isSidebarOpen: boolean = false;
  caracteristicas: string[] = [];
  textCaracter: string = '';
  today: string = new Date().toISOString().split('T')[0];

  selectedFile: File | null = null;

  private shownErrors: Set<string> = new Set(); // Para controlar notificaciones duplicadas

  tiposCarroceria = ['sedan', 'suv', 'hatchback', 'pickup', 'van', 'coupe', 'wagon', 'convertible', 'truck'];

  constructor(
    private carService: CarService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    const currentYear = new Date().getFullYear();

    this.carForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.maxLength(80)
      ]],
      marca: ['', [
        Validators.required,
        Validators.maxLength(80)
      ]],
      modelo: ['', [
        Validators.required,
        Validators.maxLength(80)
      ]],
      anio: ['', [
        Validators.required,
        Validators.min(1900),
        Validators.max(currentYear),
        Validators.pattern('^[0-9]{4}$')
      ]],
      tipoCarroceria: ['', [
        Validators.required
      ]],
      color: ['', [
        Validators.required,
        Validators.maxLength(20)
      ]],
      placas: ['', [
        Validators.required,
        Validators.maxLength(20)
      ]],
      estado: ['Disponible'],
      descripcion: ['', [
        Validators.required,
        Validators.minLength(30),
        Validators.maxLength(500)
      ]],
      precio: ['', [
        Validators.required,
        Validators.min(0),
        Validators.max(1000000),
        Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')
      ]]
    });

    // Suscribirse a los cambios de cada control
    Object.keys(this.carForm.controls).forEach(key => {
      const control = this.carForm.get(key);
      control?.valueChanges.subscribe(() => {
        if (control.touched && control.invalid) {
          this.showControlErrors(key, control);
        }
      });
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

    // Agregar suscripción a los eventos de status changes
    Object.keys(this.carForm.controls).forEach(key => {
      const control = this.carForm.get(key);
      if (control) {
        // Observar cambios de estado y cuando el campo pierde el foco
        control.statusChanges.subscribe(() => {
          if (control.touched && control.invalid) {
            this.showControlErrors(key, control);
          }
        });
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
    if (this.carForm.valid && this.caracteristicas.length > 0) {
      const formData = new FormData();
      const carData: CarData = {
        nombre: this.carForm.get('nombre')?.value,
        marca: this.carForm.get('marca')?.value,
        modelo: this.carForm.get('modelo')?.value,
        anio: this.carForm.get('anio')?.value,
        tipoCarroceria: this.carForm.get('tipoCarroceria')?.value,
        color: this.carForm.get('color')?.value,
        placas: this.carForm.get('placas')?.value,
        estado: 'Disponible',
        descripcion: this.carForm.get('descripcion')?.value,
        precio: this.carForm.get('precio')?.value,
        caracteristicas: this.caracteristicas
      };

      // Agregar los datos del carro al FormData
      Object.keys(carData).forEach(key => {
        if (key === 'caracteristicas') {
          // Agregar cada característica individualmente al FormData
          carData[key].forEach((caracteristica: string, index: number) => {
            formData.append(`caracteristicas[${index}]`, caracteristica);
          });
        } else {
          formData.append(key, carData[key]);
        }
      });

      // Agregar la imagen si existe
      if (this.selectedFile) {
        formData.append('imagen', this.selectedFile);
      }

      if (this.editingCar) {
        // Lógica para actualizar
      } else {
        this.carService.createCar(formData).subscribe({
          next: (response) => {
            this.toastr.success('Vehículo agregado correctamente', '¡Éxito!');
            this.router.navigate(['/dashboard']);
          },
          error: (error) => {
            this.toastr.error('No se pudo agregar el vehículo', 'Error');
            console.error('Error al crear el vehículo:', error);
          }
        });
      }
    } else {
      this.resetShownErrors(); // Resetear errores antes de mostrar nuevos
      Object.keys(this.carForm.controls).forEach(key => {
        const control = this.carForm.get(key);
        if (control && control.invalid) {
          this.showControlErrors(key, control);
        }
      });
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

  // Método para mostrar errores de un control específico
  showControlErrors(fieldName: string, control: AbstractControl): void {
    if (control.errors) {
      const errorKey = `${fieldName}-${Object.keys(control.errors).join('-')}`;

      if (!this.shownErrors.has(errorKey)) {
        this.shownErrors.add(errorKey);

        switch(fieldName) {
          case 'nombre':
          case 'marca':
          case 'modelo':
            if (control.errors['required']) {
              this.toastr.warning(`El ${fieldName} es requerido`);
            } else if (control.errors['maxlength']) {
              this.toastr.warning(`El ${fieldName} no debe exceder los 80 caracteres`);
            }
            break;

          case 'anio':
            if (control.errors['required']) {
              this.toastr.warning('El año es requerido');
            } else if (control.errors['min']) {
              this.toastr.warning('El año debe ser mayor a 1900');
            } else if (control.errors['max']) {
              this.toastr.warning(`El año no puede ser mayor a ${new Date().getFullYear()}`);
            } else if (control.errors['pattern']) {
              this.toastr.warning('El año debe tener 4 dígitos');
            }
            break;

          case 'color':
            if (control.errors['required']) {
              this.toastr.warning('El color es requerido');
            } else if (control.errors['maxlength']) {
              this.toastr.warning('El color no debe exceder los 20 caracteres');
            }
            break;

          case 'placas':
            if (control.errors['required']) {
              this.toastr.warning('La placa es requerida');
            } else if (control.errors['maxlength']) {
              this.toastr.warning('La placa no debe exceder los 20 caracteres');
            }
            break;

          case 'precio':
            if (control.errors['required']) {
              this.toastr.warning('El precio es requerido');
            } else if (control.errors['min']) {
              this.toastr.warning('El precio debe ser mayor a 0');
            } else if (control.errors['max']) {
              this.toastr.warning('El precio no puede ser mayor a 1,000,000');
            } else if (control.errors['pattern']) {
              this.toastr.warning('El precio debe ser un número válido con máximo 2 decimales');
            }
            break;

          case 'tipoCarroceria':
            if (control.errors['required']) {
              this.toastr.warning('El tipo de carrocería es requerido');
            }
            break;

          case 'descripcion':
            if (control.errors['required']) {
              this.toastr.warning('La descripción es requerida');
            } else if (control.errors['minlength']) {
              this.toastr.warning('La descripción debe tener al menos 30 caracteres');
            } else if (control.errors['maxlength']) {
              this.toastr.warning('La descripción no debe exceder los 500 caracteres');
            }
            break;

          case 'imagenUrl':
            if (control.errors['required']) {
              this.toastr.warning('La URL de la imagen es requerida');
            }
            break;
        }

        // Limpiar el error después de un tiempo
        setTimeout(() => {
          this.shownErrors.delete(errorKey);
        }, 3000); // 3 segundos, ajusta según necesites
      }
    }
  }

  // Método para manejar cuando un campo pierde el foco
  onBlur(fieldName: string): void {
    const control = this.carForm.get(fieldName);
    if (control) {
      control.markAsTouched(); // Marcar el control como tocado
      if (control.invalid) {
        this.showControlErrors(fieldName, control);
      }
    }
  }

  // Método para resetear los errores mostrados
  resetShownErrors(): void {
    this.shownErrors.clear();
  }

  capturarFile(event: Event){
    //mapear el input
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];

      // Verifica que el tipo MIME sea una imagen
      if (!file.type.startsWith('image/')) {
        this.toastr.error('Solo se permiten archivos de imagen.');
        this.selectedFile = null;  // Reinicia la selección de archivos
        return;
      }

      // Verifica el tamaño del archivo (máximo 5MB)
      const maxSizeInMB = 5;
      if (file.size > maxSizeInMB * 1024 * 1024) {
        this.toastr.error(`El tamaño del archivo no debe exceder los ${maxSizeInMB} MB.`);
        this.selectedFile = null;  // Reinicia la selección de archivos
        return;
      }

      this.selectedFile = file;  // Guarda el archivo seleccionado
    }

  }

}
