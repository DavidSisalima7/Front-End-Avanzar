import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Usuario } from 'app/services/models/usuario';
import { Persona } from 'app/services/models/persona';
import { DatePipe } from '@angular/common';
import { PersonaService } from 'app/services/services/persona.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './compose.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    styleUrls    : ['./compose.component.scss'],

    imports      : [MatSelectModule,MatOptionModule,MatDatepickerModule,MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent],
})
export class MailboxComposeComponent implements OnInit
{
    composeForm: UntypedFormGroup;
    copyFields: { cc: boolean; bcc: boolean } = {
        cc : false,
        bcc: false,
    };
    quillModules: any = {
        toolbar: [
            ['bold', 'italic', 'underline'],
            [{align: []}, {list: 'ordered'}, {list: 'bullet'}],
            ['clean'],
        ],
    };

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: UntypedFormBuilder, private userService: UserService,
        private datePipe: DatePipe, private personaService: PersonaService, private change: ChangeDetectorRef
    )
    {
        this.ActualizarPersona();
        this.Actualizar();
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
        this.composeForm = this._formBuilder.group({
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
                estado : ['', Validators.required],   
        });

       this.Funciones();
    }
    username:any;
   
    selectEstado:any;

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Show the copy field with the given field name
     *
     * @param name
     */
    showCopyField(name: string): void
    {
        // Return if the name is not one of the available names
        if ( name !== 'cc' && name !== 'bcc' )
        {
            return;
        }

        // Show the field
        this.copyFields[name] = true;
    }

    /**
     * Save and close
     */
    saveAndClose(): void
    {
        // Save the message as a draft
        this.saveAsDraft();

        // Close the dialog
        this.matDialogRef.close();
    }

    /**
     * Discard the message
     */
    discard(): void
    {
        this.matDialogRef.close();
        
    }


    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {
    }

    /**
     * Send the message
     */
    send(): void
    {

         this.ActualizarPersona();
        this.Actualizar();
        this.matDialogRef.close();

          window.location.reload();

    }
    // Funciones que van en el OnInit 
    Funciones(){
        this.BuscarUser();
        this.traerIdPersona();
        this.traerIdUser();
      }

    // Funciones para tranformar la fecha 
    private parseDate(dateString: string, format: string): Date {
        const parts = dateString.split('/');
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1; // Restamos 1 porque los meses en JavaScript son 0-indexados
        const year = parseInt(parts[2], 10);
        return new Date(year, month, day);
      }

    
    IdPersona: any;
    traerIdPersona(){
        this.IdPersona= localStorage.getItem('id_persona');
        console.log('Este es el Id de persona: '+ this.IdPersona);
    }

    idUsuario: any;
    traerIdUser(){
        this.idUsuario= localStorage.getItem('id');
        console.log('Este es el Id de User: '+ this.idUsuario);
    }

    
    date:Date;
    formattedDate:any;
    user: User = new User();
    persona: Persona= new Persona(); 
    BuscarUser(){
        this.username= localStorage.getItem('username');
        this.userService.BuscarUser(this.username).subscribe((response)=>{
            this.user.persona.cedula = response.persona.cedula;
            this.user.persona.primer_nombre=  response.persona.primer_nombre;
            this.user.persona.primer_apellido=  response.persona.primer_apellido;
            this.user.persona.segundo_nombre =  response.persona.segundo_nombre;
            this.user.persona.segundo_apellido =  response.persona.segundo_apellido;
            this.user.persona.celular =  response.persona.celular;
            this.user.persona.correo= response.persona.correo;
            // this.user.name= this.persona.primer_nombre;

            // console.log(this.user.name);
            // this.user.name=response.persona.primer_nombre +" " + response.persona.primer_apellido;

            if( response.persona.estado == true){
            this.selectEstado="Activo";
            this.user.persona.estado=true;
            }else{
            this.selectEstado="Inactivo";
            this.user.persona.estado=false;
            }

            this.user.persona.nacionalidad=  response.persona.nacionalidad;
            this.user.persona.genero =  response.persona.genero;
            this.user.persona.direccion= response.persona.direccion;
            // Esta perte es de la fecha 
            const parsedDate = this.parseDate( response.persona.fecha_nacimiento, 'dd/MM/yyyy');
            this.formattedDate = this.datePipe.transform(parsedDate, 'MMMM dd, yyyy');
            this.composeForm.get('fechaNacimiento').setValue(this.formattedDate);
            this.user.persona.fecha_nacimiento = this.formattedDate;
            this.date= new Date(this.formattedDate);
            this.user.persona.fecha_nacimiento = response.persona.fecha_nacimiento;
            console.log(this.user.name);
        }, error=>{
            console.log("Error al encontrar el username");
        });
    }

    

    



    // Esto vale 
   ActualizarPersona(){


    this.personaService.actualizarPersona(this.IdPersona, this.user.persona).subscribe(response=>{
        // const formattedDate = this.datePipe.transform(this.selectedDate, 'dd/MM/yyyy');

        console.log("Esto devuelve " +response);
     

    });
   }

   Actualizar(){
    this.user.name = this.user.persona.primer_nombre + " " + this.user.persona.primer_apellido;

    this.personaService.actualizarName(this.idUsuario, this.user).subscribe(response=>{
        console.log("Usuario"+ response);
         this.change.detectChanges();
    });
   }



}

