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
                genero : ['', Validators.required],              


            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName : ['', Validators.required],
                userName : ['', Validators.required],
                about    : [''],
            }),
        });
    }


    createPersona(){
        this.persona.estado = true;
        this.persona.descripcion = "Responsable de la empresa";
        this.personaService.savePersona(this.persona).subscribe(
            response => {
                console.log(response);
            },
            error => {
                console.log(error);
            }
        );
    }

    registrarPersona(): void {
        // Obtén los valores de los FormControls del FormGroup
        const cedula = this.horizontalStepperForm.get('step1.cedula')?.value;
        const primerNombre = this.horizontalStepperForm.get('step1.primerNombre')?.value;
        const genero = this.horizontalStepperForm.get('step1.genero')?.value;
        // ... otros campos ...
    
        // Ahora puedes usar los valores en tu lógica
        // Por ejemplo, configura los valores en el objeto persona
        this.persona.cedula = cedula;
        this.persona.primer_nombre = primerNombre;
        this.persona.genero = genero;
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
