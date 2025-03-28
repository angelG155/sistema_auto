import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  name:string = '';
  surname: string = '';
  email: string = '';
  password: string = '';
  phone:string = '';

  isLoading = false;
  view:boolean = false;
  isPasswordVisible: boolean = false;
  isChecked: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
  ) {

  }

  register(){

    // if(this.validacion()){
    //   this.toastr.error("Validacion","Necesitas ingresar todos los campos");
    //   return;
    // }

    let data = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      password: this.password,
      phone: this.phone,
    }

    this.isLoading = true;

    this.authService.register(data).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.isLoading = false;
        this.toastr.success("Exito","Ingresa a tu correo para poder completar tu registro");

        this.view = !this.view;
        window.scrollTo({
          top: 0,
          behavior: 'smooth'  // Hace el scroll suave
        });
      },
      error:(error:any) => {
       this.isLoading = false;
       this.displayErrors(error.error);
      }
    });

  }

  displayErrors(errors: any): void {
    for (const field in errors) {
      if (errors.hasOwnProperty(field)) {
        const errorMessages = errors[field];
        errorMessages.forEach((message: string) => {
          this.toastr.error(`Error: ${message}`);
        });
      }
    }
  }

  validacion():boolean {
    if(!this.name ||
      !this.surname ||
      !this.email ||
      !this.password ||
      !this.phone){
        return true;
    }
    return false;
  }

  passwordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  onCheckboxChange(event: any): void {
    this.isChecked = event.target.checked;
  }

  messageConfirmation(){
    this.view = !this.view;
  }



}
