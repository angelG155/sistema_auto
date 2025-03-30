import { Component, afterNextRender } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';

declare function password_show_toggle():any;
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email:string = '';
  password:string = '';
  code_user:string = '';
  constructor(
    private toastr: ToastrService,
    private authService: AuthService,
    public router: Router,
    public activedRoute: ActivatedRoute,
    ) {
      afterNextRender(() => {
        setTimeout(() => {
          password_show_toggle();
        }, 50);
      })
  }

  ngOnInit(): void {

    this.authService.initAuth();

    if (this.authService.user) {
      this.router.navigateByUrl("dashboard");
    }

    this.activedRoute.queryParams.subscribe((resp:any) => {
      this.code_user = resp.code;
    })

    if(this.code_user){
      let data = {
        code_user: this.code_user,
      }
      this.authService.verifiedAuth(data).subscribe((resp:any) => {
        console.log(resp);
        if(resp.message == 403){
          this.toastr.error("Validacion","EL codigo no pertenece a ningun usuario");
        }
        if(resp.message == 200){
          this.toastr.success("Exito","EL correo ha sido verificado ingresar a la tienda");
          setTimeout(() => {
            this.router.navigateByUrl("/login");
          }, 500);
        }
      })
    }
  }

  login(){
    if(!this.email || !this.password){
      this.toastr.error("Validacion","Necesitas ingresar todos los campos");
      return;
    }

    this.authService.login(this.email,this.password).subscribe({
      next: (response) => {
        if(response) {
          this.toastr.success('Bienvenido');
          this.router.navigateByUrl('/dashboard');
        }
      },
      error: (error) => {
        this.toastr.error('Credenciales incorrectas');
      }
    });
  }

}
