import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Persona } from 'app/services/models/persona';
import { Usuario } from 'app/services/models/usuario';
import { PersonaService } from 'app/services/services/persona.service';
import { MatOptionModule } from '@angular/material/core';

@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [MatOptionModule,RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class SignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signUpForm: UntypedFormGroup;
    showAlert: boolean = false;


    persona: Persona = new Persona();
    user: User=new User();

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private personaService: PersonaService,
        private usuarioService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.signUpForm = this._formBuilder.group({
                cedula       : ['', Validators.required],
                primernombre       : ['', Validators.required],
                segundonombre      : ['', Validators.required],
                primerapellido     : ['', Validators.required],
                segundoapellido    : ['', Validators.required],
                correo     : ['', [Validators.required, Validators.email]],
                password  : ['', Validators.required],
                direccion  : ['', Validators.required],
                celular   : ['', Validators.required],
                genero  : ['', Validators.required],
                fecha  : ['', Validators.required],
                nacionalidad   : ['', Validators.required],
                agreements: ['', Validators.requiredTrue],
            },
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up   
     */
    signUp(): void
    {

        this.persona.estado = true;
        this.persona.descripcion = 'Persona registrada desde el formulario de registro. Bienvenido y gracias por ser parte de Avanzar';
        this.user.enabled=true;
        this.user.visible=true;
        this.user.username=this.signUpForm.get('correo')?.value;
        this.user.password=this.signUpForm.get('password')?.value;
        const primerNombre = this.signUpForm.get('primernombre')?.value;
        const primerApellido = this.signUpForm.get('primerapellido')?.value;
        this.user.name=primerNombre + ' ' + primerApellido;
    
        this.personaService.savePersona(this.persona).subscribe(data => {
            console.log(data);
            this.user.persona=data;
            const rolId = 4; // ID del rol
            this.usuarioService.registrarUsuario(this.user, rolId)
            .subscribe(
                (response) => {
                  console.log('Usuario registrado exitosamente:', response);
                  // Realizar acciones adicionales después del registro exitoso si es necesario.
                },
                (error) => {
                  console.error('Error al registrar el usuario:', error);
                  // Manejo de errores si es necesario.
                }
              );
            
            this.signUpNgForm.resetForm();

        })

    }


}
