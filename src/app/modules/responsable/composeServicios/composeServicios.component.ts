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
import { Servicios } from 'app/services/models/servicios';
import { ServiciosService } from 'app/services/services/servicios.service';
import Swal from 'sweetalert2';
@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './composeServicios.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    styleUrls    : ['./composeServicios.component.scss'],

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
        private _formBuilder: UntypedFormBuilder,
        private servicioService: ServiciosService,
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
        this.composeForm = this._formBuilder.group({
            nombre : ['', Validators.required],
                precio : ['', Validators.required],
                descripcion : ['', Validators.required],  
                estado : ['', Validators.required],   
        });
        this.cargar_datos();
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
        /////cerrar
        //mensaje agregar
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
        this.ActualizarServicio();
    }

    variableSer:any;
    data:any;
    servicio: Servicios = new Servicios();
    cargar_datos(){
      this.variableSer = localStorage.getItem("idServiceSelected");
      this.servicioService.buscarServicio(this.variableSer).subscribe((dataservicio) =>{
      this.data=dataservicio;
      this.servicio.nombreServicio = this.data.nombreServicio;
      this.servicio.precioServicio = this.data.precioServicio;
      this.servicio.descripcionServicio = this.data.descripcionServicio;
      this.servicio.estado = this.data.estado ? true : false;
      })
    }

    ActualizarServicio(){
    this.servicioService.actualizarServicio(this.variableSer, this.servicio).subscribe((data)=>{
        Swal.fire(
           'Acción Exitosa',
           'Servicio Actualizado',
           'success'
                 );
       this.matDialogRef.close();
           }, error=>{
               console.log("Error al guardar");
           });
          }
}
