import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PRODUCTION, URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  getCars() {
    const url = `${URL_SERVICIOS}/autos/disponibles`;
    return this.http.get(url);
  }
}
