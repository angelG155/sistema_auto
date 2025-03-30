import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CarService, Car } from '../../../../services/car.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edite-car',
  standalone: true,
  imports: [ CommonModule, FormsModule ],
  templateUrl: './edite-car.component.html',
  styleUrl: './edite-car.component.css'
})
export class EditeCarComponent {

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
  caracteristicas: string[] = [];
  imagenUrl: string = '';
  tiposCarroceria = ['sedan', 'suv', 'hatchback', 'pickup', 'van', 'coupe', 'wagon', 'convertible', 'truck'];
  selectedFile: File | null = null;
  textCaracter: string = '';

  constructor(private toastr: ToastrService,
    private route: ActivatedRoute,
    private carService: CarService) { }

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
      this.imagenUrl = car.imagenUrlCompleta;

      this.caracteristicas = car.caracteristicas;
    });
  }

  addCharacteristics(text:string){

    if (text != "") {
      this.caracteristicas.push(text);
      this.textCaracter = "";
    }else{
      this.toastr.info('El campo no puede estar vacio');
    }

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

  deleteCharacteristics(index: number): void {
    this.caracteristicas.splice(index, 1);
  }

  updateCar(): void {
    const formData = new FormData();

    // Agregar cada campo individualmente
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

    // Enviar cada característica como un elemento separado del array
    this.caracteristicas.forEach((caracteristica, index) => {
      formData.append(`caracteristicas[${index}]`, caracteristica);
    });

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.carService.updateCar(this.id, formData).subscribe({
      next: (response) => {
        this.toastr.success('Automóvil actualizado correctamente');
      },
      error: (error) => {
        this.toastr.error('Error al actualizar el automóvil' + error.error.error);
        console.error('Error:', error);
      }
    });
  }

}
