import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { LoginService } from 'app/services/login/login.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [RouterLink, FuseAlertComponent, NgIf, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})

export class SingInComponent implements OnInit {


    @ViewChild('signInNgForm') signInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private loginService: LoginService,

    ) {

    }

    ngOnInit(): void {

         // Create the form
         this.signInForm = this._formBuilder.group({
            username     : ['', [Validators.required,Validators.email]],
            password  : ['', Validators.required],
            rememberMe: ''
        }); 

    }

    signIn(): void {
        const username = this.signInForm.get('username').value;
        const password = this.signInForm.get('password').value;
    
        // Return if the form is invalid
        if (this.signInForm.invalid) {
            return;
        }
    
        // Disable the form
        this.signInForm.disable();
    
        // Hide the alert
        this.showAlert = false;

        this.loginService.generarToken({ username: username, password: password }).subscribe(
        (data:any) => {
            this.loginService.loginUser(data.token);
            // Llamamos al método para obtener el usuario actual
            this.obtenerUsuarioActual();

        },
        (error) => {
            // Re-enable the form
            this.signInForm.enable();

            // Reset the form
            this.signInNgForm.resetForm();

            // Set the alert
            this.alert = {
                type: 'error',
                message: 'Wrong email or password',
            };

            // Show the alert
            this.showAlert = true;

            console.log(error);
        }
    );

    }

        obtenerUsuarioActual(): void {
            // Return if the form is invalid
            if ( this.signInForm.invalid )
            {
                return;
            }
      
            // Disable the form
            this.signInForm.disable();
           this.loginService.getUsuarioActual().subscribe(
             (user: any) => {
               if (user) {
                 // Si se reciben los detalles del usuario correctamente, almacénalos en el servicio
                 this.loginService.setUser(user);
                 const userRole = this.loginService.getUserRole();
                 // Redirigir según el rol del usuario
                 switch (userRole) {
                   case 'ADMIN':
                     console.log("es admin");
                    //Poner la ruta
                     break;
                   case 'RESPONSABLE_VENTAS':
                     console.log("es responsable");
                     // this.router.navigate(['/perfilre']);
                     break;
                   case 'VENDEDOR':
                     console.log("es vendedor");
                     // this.router.navigate(['/perfilve']);
                     break;
                   case 'CLIENTE':
                     console.log("es cliente");
                     // this.router.navigate(['/perfilcli']);
                     break;
                   default:
                     this.loginService.logout(); // En caso de un rol desconocido o no válido, cerrar sesión
                 }
               } else {
                 // Si no se reciben los detalles del usuario (puede ser nulo en caso de error),
                 // puedes realizar alguna acción o mostrar un mensaje de error.
                 console.log('No se pudo obtener el usuario actual.');
               }
             },
             (error) => {
               console.log('Error al obtener el usuario actual:', error);
             }
           );
         }
        
}
