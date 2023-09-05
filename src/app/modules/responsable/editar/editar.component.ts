import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { Persona } from 'app/services/models/persona';
import { PersonaService } from 'app/services/services/persona.service';
import { MatTableDataSource } from '@angular/material/table';
@Component({
    selector     : 'mailbox-editar',
    templateUrl  : './editar.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    styleUrls    : ['./editar.component.scss'],

    imports      : [MatSelectModule,MatOptionModule,MatDatepickerModule,MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, NgIf, QuillEditorComponent],
})
export class MailboxeditarComponent implements OnInit
{
    Personas: Persona = new Persona();
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
    dataSource: any;
    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxeditarComponent>,
        private _formBuilder: UntypedFormBuilder,
        private servicioactualizar: PersonaService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.composeForm = this._formBuilder.group({
          cedula: ['', Validators.required],
          primerNombre: ['', Validators.required],
          segundoNombre: ['', Validators.required],
          primerApellido: ['', Validators.required],
          segundoApellido: ['', Validators.required],
          correoElectronico: ['', [Validators.required, Validators.email]],
          direccion: ['', Validators.required],
          celular: ['', Validators.required],
          fechaNacimiento: [null, Validators.required],
          genero: ['', Validators.required],
          nacionalidad: ['', Validators.required],
          estado: [true, Validators.required],
        });
    }

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
    saveAndClose(): void {
        // Guardar el mensaje como borrador
        this.saveAsDraft();
      
        // Guardar los cambios en el servidor
        this.servicioactualizar.actualizarPersona(this.Personas.cedula, this.Personas).subscribe({
          next: (response) => {
            alert("Registrado");
    
            // Recargar la página para mostrar los datos actualizados
            window.location.reload();
          },
          error: (error) => {
            alert("No registrado");
          },
          complete: () => {
            // Cerrar el diálogo
            this.matDialogRef.close();
          },
        });
      }

    /**
     * Discard the message
     */
     discard(): void {
    // Close the dialog
    this.matDialogRef.close();
  }


    /**
     * Save the message as a draft
     */
    saveAsDraft(): void
    {

        this.Personas.cedula= this.composeForm.get('cedula')?.value;
        this.Personas.primer_nombre= this.composeForm.get('primerNombre')?.value;
        this.Personas.segundo_nombre= this.composeForm.get('segundoNombre')?.value;
        this.Personas.primer_apellido= this.composeForm.get('primerApellido')?.value;
        this.Personas.segundo_apellido= this.composeForm.get('segundoApellido')?.value;
        this.Personas.genero= this.composeForm.get('genero')?.value;
        this.Personas.fecha_nacimiento= this.composeForm.get('fechaNacimiento')?.value;
        this.Personas.nacionalidad= this.composeForm.get('nacionalidad')?.value;
        this.Personas.correo= this.composeForm.get('correoElectronico')?.value;
        this.Personas.direccion= this.composeForm.get('direccion')?.value;
        this.Personas.celular= this.composeForm.get('celular')?.value;
       
      
   
        
        const estadoSeleccionado = this.composeForm.get('estado').value;
  this.Personas.estado = estadoSeleccionado === 'activo';
  console.log('Estado seleccionado:', this.Personas.estado);
      

       
    }

    /**
     * Send the message
     */
   
}