import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { PersonaService } from 'app/services/services/persona.service';
import { UserService } from 'app/core/user/user.service';
import { Persona } from 'app/services/models/persona';

@Component({
    selector     : 'register-responsable',
    templateUrl  : './register-responsable.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, 
        MatButtonModule, MatCheckboxModule, MatRadioModule,MatTableModule,MatTabsModule,MatDatepickerModule],
})
export class RegisterResponsableComponent implements OnInit
{
    horizontalStepperForm: FormGroup;
    persona: Persona = new Persona();
    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, 
                private personaService: PersonaService, 
                private usuarioService: UserService)
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

        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                cedula : ['', Validators.required],
                primerNombre : ['', Validators.required],
                segundoNombre : ['', Validators.required],
                primerApellido : ['', Validators.required],
                segundoApellido : ['', Validators.required],
                correoElectronico : ['', [Validators.required, Validators.email]],
                direccion : ['', Validators.required],
                celular : ['', Validators.required],
                fechaNacimiento : [null, Validators.required],
                genero : ['', Validators.required],    
                nacionalidad : ['', Validators.required],          


            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName : ['', Validators.required],
                userName : ['', Validators.required],
                about    : [''],
            }),
        });
    }


    registrarPersona(): void {
        // Obtén los valores de los FormControls del FormGroup
        const cedula = this.horizontalStepperForm.get('step1.cedula')?.value;
        const primerNombre = this.horizontalStepperForm.get('step1.primerNombre')?.value;
        const segundoNombre = this.horizontalStepperForm.get('step1.segundoNombre')?.value;
        const primerApellido = this.horizontalStepperForm.get('step1.primerApellido')?.value;
        const segundoApellido = this.horizontalStepperForm.get('step1.segundoApellido')?.value;
        const fechaNacimiento = this.horizontalStepperForm.get('step1.fechaNacimiento')?.value;
        const genero = this.horizontalStepperForm.get('step1.genero')?.value;
        const correoElectronico = this.horizontalStepperForm.get('step1.correoElectronico')?.value;
        const direccion = this.horizontalStepperForm.get('step1.direccion')?.value;
        const celular = this.horizontalStepperForm.get('step1.celular')?.value;
        const nacionalidad = this.horizontalStepperForm.get('step1.nacionalidad')?.value;
        // ... otros campos ...

        this.persona.cedula = cedula;
        this.persona.primer_nombre = primerNombre;
        this.persona.segundo_nombre = segundoNombre;  
        this.persona.primer_apellido = primerApellido;
        this.persona.segundo_apellido = segundoApellido; 
        this.persona.fecha_nacimiento = fechaNacimiento; 
        this.persona.genero = genero;
        this.persona.correo = correoElectronico;
        this.persona.direccion = direccion;
        this.persona.celular = celular;
        this.persona.nacionalidad = nacionalidad;

        this.persona.estado = true;
        this.persona.descripcion = "Persona registrada desde el formulario de registro de responsable";
        // ... otros campos ...
    
        // Luego, realiza la llamada al servicio para guardar la persona y el usuario
        // ... código para guardar persona y usuario ...
        this.personaService.savePersona(this.persona).subscribe(
            (response) => {
                // Si la respuesta es correcta, muestra un mensaje de éxito
                console.log(response);

                
            },
        );
    
        // Restablece el formulario después de guardar los datos
        this.horizontalStepperForm.reset();
    }
}
