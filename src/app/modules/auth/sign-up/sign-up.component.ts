import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
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
    imports      : [MatOptionModule,RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, 
                    MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule],
})
export class SignUpComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    signUpForm: FormGroup;
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

    signUp(): void {
        // Obtén los valores de los FormControls del FormGroup
        const cedula = this.signUpForm.get('cedula')?.value;
        const primerNombre = this.signUpForm.get('primernombre')?.value;
        const segundoNombre = this.signUpForm.get('segundonombre')?.value;
        // ... otros campos ...
    
        // Ahora puedes usar los valores en tu lógica
        // Por ejemplo, configura los valores en el objeto persona
        this.persona.cedula = cedula;
        this.persona.primer_nombre = primerNombre;
        this.persona.segundo_nombre = segundoNombre;
        // ... otros campos ...
    
        // Luego, realiza la llamada al servicio para guardar la persona y el usuario
        // ... código para guardar persona y usuario ...
        this.personaService.savePersona(this.persona).subscribe(
            (response) => {
                // Si la respuesta es correcta, muestra un mensaje de éxito
                console.log(response);
                this.alert = {
                    type   : 'success',
                    message: 'Se ha creado la persona correctamente',
                };
                this.showAlert = true;
            },
            (error) => {
                // Si la respuesta es incorrecta, muestra un mensaje de error
                this.alert = {
                    type   : 'error',
                    message: 'Ha ocurrido un error al crear la persona',
                };
                this.showAlert = true;
            }
        );
    
        // Restablece el formulario después de guardar los datos
        this.signUpForm.reset();
    }


}
