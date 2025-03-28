import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL_SERVICIOS } from '../config/config';

export interface Car {
  id?: number;
  nombre: string;
  marca: string;
  modelo: string;
  anio: number;
  tipoCarroceria: string;
  color: string;
  placas: string;
  estado: string;
  descripcion: string;
  precio: string;
  imagenUrlCompleta: string;
  ulimoServicio: string;
  caracteristicas: string[];
}

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private apiUrl = `${URL_SERVICIOS}/autos`;

  constructor(private http: HttpClient) { }

  getCars(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  getCar(id: number): Observable<Car> {
    return this.http.get<Car>(`${this.apiUrl}/${id}`);
  }

  createCar(car: Car): Observable<Car> {
    return this.http.post<Car>(this.apiUrl, car);
  }

  updateCar(id: number, car: Car): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, car);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCarStatus(id: number, estado: string): Observable<Car> {
    return this.http.patch<Car>(`${this.apiUrl}/${id}/estado`, { estado });
  }
}
