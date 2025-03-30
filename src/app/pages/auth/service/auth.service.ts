import { HttpClient } from '@angular/common/http';
import { Injectable, afterNextRender } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, Observable, tap } from 'rxjs';
import { URL_SERVICIOS } from '../../../config/config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  token:string = '';
  user:any;
  constructor(
    public http: HttpClient,
    public router: Router,
  ) {
    afterNextRender(() => {
      this.initAuth();
    })
  }

  initAuth() {
    if (typeof window !== 'undefined') {
        this.user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") ?? '') : null;
    }
  }


  login(email: string, password: string): Observable<any> {
    if (email === 'admin' && password === 'admin') {
      const mockResponse = {
        user: {
          email: email,
          role: 'admin'
        },
        token: 'mock-token-123'
      };

      localStorage.setItem('token', mockResponse.token);
      localStorage.setItem('user', JSON.stringify(mockResponse.user));
      this.user = mockResponse.user;

      return of(mockResponse);
    }

    return of(null).pipe(
      tap(() => {
        throw new Error('Credenciales incorrectas');
      })
    );
  }

  saveLocalStorage(resp:any){
    if(resp){
      localStorage.setItem("user",JSON.stringify(resp));
      return true;
    }
    console.log("no se guardo");
    return false;
  }

  register(data:any){
    let URL = URL_SERVICIOS+"/auth/register";
    return this.http.post(URL,data);
  }

  verifiedAuth(data:any){
    let URL = URL_SERVICIOS+"/auth/verified_auth";
    return this.http.post(URL,data);
  }

  verifiedMail(data:any){
    let URL = URL_SERVICIOS+"/auth/verified_email";
    return this.http.post(URL,data);
  }

  verifiedCode(data:any){
    let URL = URL_SERVICIOS+"/auth/verified_code";
    return this.http.post(URL,data);
  }

  verifiedNewPassword(data:any){
    let URL = URL_SERVICIOS+"/auth/new_password";
    return this.http.post(URL,data);
  }

  logout(){
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    this.user = null;
    this.token = '';
    setTimeout(() => {
      this.router.navigateByUrl("");
    }, 500);
  }
}
