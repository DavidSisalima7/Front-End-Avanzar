import { user } from './../../../mock-api/common/user/data';
import { FuseAlertType } from './../../../../@fuse/components/alert/alert.types';
import { Component, OnInit, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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
import { DatePipe, NgClass, NgIf } from '@angular/common';
import { FuseAlertComponent } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';
import { User } from 'app/core/user/user.types';
import { ChangeDetectionStrategy } from '@angular/compiler';
import { FuseCardComponent } from '@fuse/components/card';
import { VendedorService } from 'app/services/services/vendedora.service';
import { Vendedora } from 'app/services/models/vendedora';

@Component({
    selector     : 'register-emprendedora',
    templateUrl  : './register-emprendedora.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone   : true,
    imports      : [MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, 
        MatButtonModule, MatCheckboxModule, MatRadioModule,MatTableModule,MatTabsModule,MatDatepickerModule,
        NgIf, FuseAlertComponent, NgClass, FuseCardComponent],
})
export class RegisterEmpreRespComponent implements OnInit
{
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };

    showAlert: boolean = false;

    horizontalStepperForm: FormGroup;
    persona: Persona = new Persona();
    vendedora: Vendedora = new Vendedora();
    selectedDate:Date;
    selectedFile: File | null = null;
    user: User=new User();
    yearlyBilling: boolean = true;
    clickedButtonValue: number = 0; // Inicializar con 0

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder, 
                private personaService: PersonaService, 
                private usuarioService: UserService,
                private datePipe:DatePipe,
                private vendedorService: VendedorService
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
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                cedula : ['', Validators.required],
                primerNombre : ['', Validators.required],
                segundoNombre : ['', Validators.required],
                primerApellido : ['', Validators.required],
                segundoApellido : ['', Validators.required],
                correo   : ['', [Validators.required, Validators.email]],
                direccion : ['', Validators.required],
                celular: ['', Validators.required],
                fechaNacimiento : ['', Validators.required],
                genero : ['', Validators.required],
                nacionalidad : ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                usuario: ['', Validators.required],
                email : ['', Validators.required],
                password : ['', Validators.required],
                avatar : [''],
                descripcion    : [''],
            }),
            step3: this._formBuilder.group({
                rolUser: ['Responsable', Validators.required],
            }),
        });


            // Listen to changes in the 'correo' field in step1
    this.horizontalStepperForm
    .get('step1.correo')
    .valueChanges.subscribe((correoValue) => {
      // Set the value of 'email' in step2 to the same value as 'correo'
      this.horizontalStepperForm.get('step2.email').setValue(correoValue);
    });

    this.horizontalStepperForm.valueChanges.subscribe((formValues) => {
        const primerNombreValue = formValues.step1.primerNombre;
        const primerApellidoValue = formValues.step1.primerApellido;
    
        const usuarioValue = primerNombreValue + ' ' + primerApellidoValue;
    
        // Verifica si el valor actual es diferente antes de establecerlo
        const currentUsuarioValue = this.horizontalStepperForm.get('step2.usuario').value;
        if (currentUsuarioValue !== usuarioValue) {
            this.horizontalStepperForm.get('step2.usuario').setValue(usuarioValue);
        }
    });
    


    }


    registrarPersona(): void {
        // Obtén los valores de los FormControls del FormGroup
        const cedula = this.horizontalStepperForm.get('step1.cedula')?.value;
        const primerNombre = this.horizontalStepperForm.get('step1.primerNombre')?.value;
        const segundoNombre = this.horizontalStepperForm.get('step1.segundoNombre')?.value;
        const primerApellido = this.horizontalStepperForm.get('step1.primerApellido')?.value;
        const segundoApellido = this.horizontalStepperForm.get('step1.segundoApellido')?.value;
        const genero = this.horizontalStepperForm.get('step1.genero')?.value;
        const correoElectronico = this.horizontalStepperForm.get('step1.correo')?.value;
        const direccion = this.horizontalStepperForm.get('step1.direccion')?.value;
        const celular = this.horizontalStepperForm.get('step1.celular')?.value;
        const nacionalidad = this.horizontalStepperForm.get('step1.nacionalidad')?.value;
        const formattedDate = this.datePipe.transform(this.selectedDate, 'dd/MM/yyyy');
        const descripcion = this.horizontalStepperForm.get('step2.descripcion')?.value;

        // DATOS USUARIO

        const name = this.horizontalStepperForm.get('step2.usuario')?.value;
        const username = this.horizontalStepperForm.get('step2.email')?.value;
        const password = this.horizontalStepperForm.get('step2.password')?.value;
        const avatar = this.horizontalStepperForm.get('step2.avatar')?.value;

        // ... otros campos ...

        this.persona.cedula = cedula;
        this.persona.primer_nombre = primerNombre;
        this.persona.segundo_nombre = segundoNombre;  
        this.persona.primer_apellido = primerApellido;
        this.persona.segundo_apellido = segundoApellido; 
        this.persona.fecha_nacimiento = formattedDate; 
        this.persona.genero = genero;
        this.persona.correo = correoElectronico;
        this.persona.direccion = direccion;
        this.persona.celular = celular;
        this.persona.nacionalidad = nacionalidad;
        this.persona.descripcion = descripcion;
        this.persona.estado = true;


        // DATOS USUARIO

        this.user.name = primerNombre + ' ' + primerApellido;
        this.user.username = username;
        this.user.password = password;
        this.user.avatar = avatar;
        this.user.enabled = true;
        this.user.visible = true;

        // ... otros campos ...
    
        // Luego, realiza la llamada al servicio para guardar la persona y el usuario
        // ... código para guardar persona y usuario ...
        this.personaService.savePersona(this.persona).subscribe(data => {
            console.log(data);
            this.user.persona = data;
            const rolId = 2; // ID del rol
            this.usuarioService.registrarUsuarioConFoto(this.user, rolId, this.selectedFile)
              .subscribe(
                  (response) => {
                    this.vendedora.usuario = response;
                    this.vendedora.nombreEmprendimiento = "VAMOOOS";
                      console.log(response);

                      this.vendedorService.registrarVendedor(this.vendedora, this.clickedButtonValue).subscribe(dataVendedora => {

                        console.log(dataVendedora);

                      });
                      
                  },
                  
                );
              
          })
    
        // Restablece el formulario después de guardar los datos
    }

    upload(event:any){
        const file=event.target.files[0];
        this.selectedFile=file;
        
    }

    alerta(): void {
        this.alert = {
            type: 'success',
            message: 'Su registro se ha realizado correctamente',
        };
        this.showAlert = true;
    
        setTimeout(() => {
            this.showAlert = false; // Ocultar la alerta después de 4 segundos
        }, 4000); // 4000 milisegundos = 4 segundos
    }

    handleClick(buttonValue: number) {
        this.clickedButtonValue = buttonValue;
        console.log("BOTON", this.clickedButtonValue);
      }

     
    
}