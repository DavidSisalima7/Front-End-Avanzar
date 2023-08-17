import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup,NgForm, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fuseAnimations } from '@fuse/animations';
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';
import { FuseAlertType } from '@fuse/components/alert';

@Component({
    selector     : 'register-responsable',
    templateUrl  : './register-responsable.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone   : true,
    imports      : [MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, 
    MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, 
    MatButtonModule, MatCheckboxModule, MatRadioModule,MatTableModule,MatTabsModule,
    MatDatepickerModule,NgIf,MatProgressSpinnerModule],
})
export class RegisterResponsableComponent implements OnInit
{   

    private personaResponse: any | null = null; // Variable para almacenar la persona registrada

    horizontalStepperForm: FormGroup;
    persona: Persona = new Persona();
    user: User;
    usuario: User=new User();
    coincidenContrasenias: boolean = true;
    selectedFile: File | null = null;


    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };

    

    showAlert: boolean = false;
    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, 
                private personaService: PersonaService, 
                private usuarioService: UserService,
                private _userService: UserService)
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
                avatar:[''],
                email: ['', [Validators.required, Validators.email]],
                user : ['', Validators.required],
                password : ['', Validators.required],
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
        // Luego, realiza la llamada al servicio para guardar la persona y el usuario
        // ... código para guardar persona y usuario ...
        this.personaService.savePersona(this.persona).subscribe(
            (response) => {
                this.personaResponse=response;
                this.horizontalStepperForm.get('step2').patchValue({
                    user: primerNombre+" "+primerApellido,
                    email: correoElectronico,
                  });
                
            },
        );
    
        // Restablece el formulario después de guardar los datos
        this.horizontalStepperForm.reset();
    }


    //Metodo para registrar el usuario en el paso 2 
    registrarUsuario(): void {
        this.usuario.enabled = true;
        this.usuario.visible = true;
        this.usuario.username = this.horizontalStepperForm.get('step2.email')?.value;
        this.usuario.password = this.horizontalStepperForm.get('step2.password')?.value;
        this.usuario.name = this.horizontalStepperForm.get('step2.user')?.value;
        this.usuario.avatar=this.horizontalStepperForm.get('step2.avatar')?.value;
        this.usuario.persona=this.personaResponse;
        
        
          const rolId = 2; // ID del rol
          this.usuarioService.registrarUsuarioConFoto(this.usuario, rolId,this.selectedFile)
            .subscribe(
                (response) => {
                    console.log(response);
                    /* this.alert = {
                        type   : 'success',
                        message: 'Su registro se a realizado correctamente',
                    };
                    this.showAlert = true; */
                    
                },
                (error) => {
                    console.log(error);
                  /*   
                    this.alert = {
                        type   : 'error',
                        message: 'Ha ocurrido un error al crear el usuario',
                    };
                    this.showAlert = true; */
                }
                
              );
            
            this.horizontalStepperForm.reset();

    } 

    upload(event:any){
        const file=event.target.files[0];
        this.selectedFile=file;
        
    }


}
