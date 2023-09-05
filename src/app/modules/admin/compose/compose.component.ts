import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { PersonaService } from 'app/services/services/persona.service';
import { Persona } from 'app/services/models/persona';

import { MatTableDataSource } from '@angular/material/table';
import { validacion } from 'app/services/models/validacion';
import { FuseAlertType } from '@fuse/components/alert/alert.types';
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
  securityForm: FormGroup;
  @ViewChild('securityNgForm') securityNgForm: NgForm;
  showAlert: boolean = false;
  alertType: string = ''; // Puede ser 'error', 'success', u otro tipo
  alertMessage: string = '';
  vali: validacion = new validacion();

  //alertas pass
  showAlertPassEqu = false;
  showAlertPassSecu = false;
  showAlertPassUpda = false;
  showAlertCurrentPas = false;
  longPass = "";
  equPass = "";

  alertUpdaPass: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: '',
  };
  alertCurrentPass: { type: FuseAlertType; message: string } = {
    type: 'error',
    message: '',
  };    
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
      public matDialogRef: MatDialogRef<MailboxComposeComponent>,
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
      descripcion: ['', Validators.required],
      celular: ['', Validators.required],
      fechaNacimiento: [null, Validators.required],
      genero: ['', Validators.required],
      nacionalidad: ['', Validators.required],
      estado: [true, Validators.required],
      password: ['', Validators.required],
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
        // Verificar si la respuesta no es nula ni indefinida como señal de éxito
        if (response !== null && response !== undefined) {
          this.showSuccessAlert("Registrado");
          // Actualizar la tabla llamando al método que obtiene los datos actualizados
          this.listarRegistros();
          // Recargar la página para mostrar los datos actualizados
          window.location.reload();
        } else {
          this.showErrorAlert("No registrado");
        }
      },
      error: (error) => {
        this.showErrorAlert("Error en el servidor");
      },
      complete: () => {
        // Cerrar el diálogo
        this.matDialogRef.close();
      },
    });
  }
  showSuccessAlert(message: string): void {
    this.alertType = 'success';
    this.alertMessage = message;
    this.showAlert = true;
  }
  
  // Método para mostrar una alerta de error
  showErrorAlert(message: string): void {
    this.alertType = 'error';
    this.alertMessage = message;
    this.showAlert = true;
  }
  listarRegistros(): void {
    // Obtener los datos actualizados de la tabla desde el servicio
    this.servicioactualizar.listarPersona().subscribe(
      (datosTabla) => {
        // Actualizar el dataSource con los datos obtenidos
        this.dataSource = new MatTableDataSource(datosTabla);
      },
      (error) => {
        // Manejar el error al obtener los datos de la tabla
      }
    );
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
    // this.Personas.segundo_nombre= this.composeForm.get('segundoNombre')?.value;
    // this.Personas.primer_apellido= this.composeForm.get('primerApellido')?.value;
    // this.Personas.segundo_apellido= this.composeForm.get('segundoApellido')?.value;
    // this.Personas.genero= this.composeForm.get('genero')?.value;
    // this.Personas.fecha_nacimiento= this.composeForm.get('fechaNacimiento')?.value;
    // this.Personas.nacionalidad= this.composeForm.get('nacionalidad')?.value;
    this.Personas.descripcion= this.composeForm.get('descripcion')?.value;
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