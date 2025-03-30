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
  caracteristicas: string[];
  top_sales: boolean;
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

  createCar(data: FormData): Observable<Car> {
    return this.http.post<Car>(`${this.apiUrl}`, data);
  }

  updateCar(id: number, data: FormData): Observable<Car> {
    return this.http.put<Car>(`${this.apiUrl}/${id}`, data);
  }

  deleteCar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateCarStatus(id: number, estado: string): Observable<Car> {
    return this.http.patch<Car>(`${this.apiUrl}/${id}/estado`, { estado });
  }

  getCarshome() {
    const url = `${URL_SERVICIOS}/autos`;
    return this.http.get(url);
  }

  changeTopSales(id: number, topSales: boolean) {
    return this.http.patch<Car>(`${this.apiUrl}/${id}/top-sales`, { top_sales: topSales });
  }
}
