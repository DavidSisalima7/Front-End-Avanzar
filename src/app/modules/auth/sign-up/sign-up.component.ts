import { DatePipe, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDateFormats } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
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


@Component({
    selector     : 'auth-sign-up',
    templateUrl  : './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [RouterLink, NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule, MatProgressSpinnerModule, MatDatepickerModule],
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

    //fechas
    selectedDate:Date;

    persona: Persona = new Persona();
    user: User=new User();
    selectedFile: File | null = null;
    //Variable para el combo Box de genero que almacena el resultado
    public generoSeleccionado:string;



    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private personaService: PersonaService,
        private usuarioService: UserService,
        private datePipe:DatePipe
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
                fecha_nacimiento :['',Validators.required],
                genero:['',Validators.required],
                agreements: ['', Validators.requiredTrue],
            },
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    // Método para verificar si el formulario es válido y si se han aceptado los términos
    isFormValidAndAccepted(): boolean {
        return this.signUpForm.valid && this.signUpForm.get('agreements').value;
    }
    
    /**
     * Sign up
     */
    signUp(): void {
        this.persona.estado = true;
        this.persona.nacionalidad="Ecuador"
        this.user.enabled = true;
        this.user.visible = true;
        this.user.username = this.signUpForm.get('correo')?.value;
        this.user.password = this.signUpForm.get('password')?.value;
        const primerNombre = this.signUpForm.get('primernombre')?.value;
        const primerApellido = this.signUpForm.get('primerapellido')?.value;
        const generoSeleccionado = this.signUpForm.get('genero').value
        const formattedDate = this.datePipe.transform(this.selectedDate, 'dd/MM/yyyy');
        this.persona.descripcion="Hola mi nombre es "+primerNombre+' '+primerApellido+" encantado de concerte. ♥";
        this.user.name = primerNombre + ' ' + primerApellido;
        this.persona.fecha_nacimiento=formattedDate;
        this.persona.genero = generoSeleccionado;
        

        this.personaService.savePersona(this.persona).subscribe(data => {
          console.log(data);
          this.user.persona = data;
          const rolId = 4; // ID del rol
          this.usuarioService.registrarUsuarioConFoto(this.user, rolId, this.selectedFile)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.alert = {
                        type   : 'success',
                        message: 'Su registro se a realizado correctamente',
                    };
                    this.showAlert = true;
                },
                (error) => {
                    this.alert = {
                        type   : 'error',
                        message: 'Ha ocurrido un error al crear el usuario',
                    };
                    this.showAlert = true;
                }
              );
            
            this.signUpNgForm.resetForm();

        })

    } 


    upload(event:any){
        const file=event.target.files[0];
        this.selectedFile=file;
        /* if (file) {
            const formData=new FormData();
            formData.append('file',file);

            this.usuarioService.uploadFile(formData)
            .subscribe(response=>{
                console.log('response',response);
                
            })
        } */
    }


}
