import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CarService, Car } from '../../../../services/car.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-car',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './list-car.component.html',
  styleUrl: './list-car.component.css'
})
export class ListCarComponent {
  cars: Car[] = [];
  filteredCars: Car[] = [];


  // Filtros
  filtroEstado: string = '';
  filtroPrecioMin: number | null = null;
  filtroPrecioMax: number | null = null;
  filtroAnioMin: number | null = null;
  filtroAnioMax: number | null = null;

  constructor(
    private carService: CarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService.getCars().subscribe(cars => {
      this.cars = cars;
      this.aplicarFiltros(); // Aplicar filtros cada vez que se cargan los autos
    });
  }

  aplicarFiltros(): void {
    this.filteredCars = this.cars.filter(car => {
      let cumpleFiltros = true;

      // Filtro por estado
      if (this.filtroEstado && this.filtroEstado !== '') {
        cumpleFiltros = car.estado.toLowerCase() === this.filtroEstado.toLowerCase();
      }

      // Filtro por precio
      const precio = this.extraerNumero(car.precio);
      if (this.filtroPrecioMin && precio < this.filtroPrecioMin) {
        cumpleFiltros = false;
      }
      if (this.filtroPrecioMax && precio > this.filtroPrecioMax) {
        cumpleFiltros = false;
      }

      // Filtro por año
      if (this.filtroAnioMin && car.anio < this.filtroAnioMin) {
        cumpleFiltros = false;
      }
      if (this.filtroAnioMax && car.anio > this.filtroAnioMax) {
        cumpleFiltros = false;
      }

      return cumpleFiltros;
    });
  }

  extraerNumero(precio: string): number {
    // Elimina el símbolo de moneda y las comas, y convierte a número
    return Number(precio.replace(/[$,]/g, ''));
  }

  limpiarFiltros(): void {
    this.filtroEstado = '';
    this.filtroPrecioMin = null;
    this.filtroPrecioMax = null;
    this.filtroAnioMin = null;
    this.filtroAnioMax = null;
    this.aplicarFiltros();
  }

  async changeCarStatus(car: Car): Promise<void> {
    try {
      const { value: newStatus } = await Swal.fire({
        title: 'Cambiar Estado',
        text: 'Selecciona el nuevo estado del automóvil',
        input: 'select',
        inputOptions: {
          'disponible': 'Disponible',
          'vendido': 'Vendido',
          'mantenimiento': 'En mantenimiento'
        },
        inputPlaceholder: 'Selecciona un estado',
        showCancelButton: true,
        confirmButtonText: 'Cambiar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
          if (!value) {
            return 'Debes seleccionar un estado';
          }
          return null;
        }
      });

      if (newStatus) {
        // Guardamos el estado anterior por si hay error
        const estadoAnterior = car.estado;

        // Actualizamos optimistamente la UI
        const index = this.cars.findIndex(c => c.id === car.id);
        if (index !== -1) {
          this.cars[index] = {
            ...car,
            estado: newStatus
          };
          this.aplicarFiltros();
        }

        // Actualizamos en el servidor
        this.carService.updateCarStatus(car.id!, newStatus).subscribe({
          next: (updatedCar) => {
            Swal.fire({
              title: '¡Estado Actualizado!',
              text: `El automóvil ahora está ${newStatus}`,
              icon: 'success',
              timer: 1500
            });
          },
          error: (error) => {
            console.error('Error al actualizar el estado:', error);

            // Revertimos el cambio en caso de error
            if (index !== -1) {
              this.cars[index] = {
                ...car,
                estado: estadoAnterior
              };
              this.aplicarFiltros();
            }

            Swal.fire(
              'Error',
              'Hubo un problema al actualizar el estado del automóvil.',
              'error'
            );
          }
        });
      }
    } catch (error) {
      console.error('Error al cambiar el estado:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al cambiar el estado del automóvil.',
        'error'
      );
    }
  }



  goToEdit(id: number): void {
    this.router.navigate(['/dashboard/edit', id]);
  }

  async deleteCar(id: number): Promise<void> {
    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Deseas eliminar este automóvil? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        this.carService.deleteCar(id).subscribe(() => {
          Swal.fire(
            '¡Eliminado!',
            'El automóvil ha sido eliminado correctamente.',
            'success'
          );
          this.loadCars(); // Recargar la lista después de eliminar
        });
      }
    } catch (error) {
      console.error('Error al eliminar el automóvil:', error);
      Swal.fire(
        'Error',
        'Hubo un problema al eliminar el automóvil.',
        'error'
      );
    }
  }




}
