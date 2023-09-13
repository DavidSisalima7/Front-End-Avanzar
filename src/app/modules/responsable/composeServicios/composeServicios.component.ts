import { CommonModule, NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { QuillEditorComponent } from 'ngx-quill';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { ServicioModels, Servicios } from 'app/services/models/servicios';
import { ServiciosService } from 'app/services/services/servicios.service';
import Swal from 'sweetalert2';
import { ListRespServiciosComponent } from '../list-servicios/list-servicios.component';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { Publicacion } from 'app/services/models/publicaciones';
@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './composeServicios.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    styleUrls    : ['./composeServicios.component.scss'],

    imports: [MatSelectModule, MatOptionModule, MatDatepickerModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
        MatInputModule, NgIf, QuillEditorComponent, CommonModule, MatNativeDateModule],
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

    categorias = [
        { value: 'Belleza', label: 'Belleza' },
        { value: 'Costura', label: 'Costura' },
        { value: 'Hogar', label: 'Hogar' },
    ];

    tipos = [
        { value: 'Productos', label: 'Productos' },
        { value: 'Servicios', label: 'Servicios' },
    ];

    @Output() confirmacionCerrada: EventEmitter<boolean> = new EventEmitter<boolean>();

    publicacion : Publicacion;
    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: UntypedFormBuilder,
        private servicioService: ServiciosService,
        private publicacionService: PublicacionesService,
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

        this.publicacionService.buscarPublicacionId(ListRespServiciosComponent.idPublicacionSeleccionado).subscribe((data) => {
            this.publicacion = data;
            // Create the form
            this.composeForm = this._formBuilder.group({
                titulopubli: [this.publicacion.tituloPublicacion, Validators.required],
                descripcionpubli: [this.publicacion.descripcionPublicacion, Validators.required],
                nombreServicio: [this.publicacion.servicios.nombreServicio, Validators.required],
                vendedor: [this.publicacion.vendedor.usuario.persona.primer_nombre, Validators.required],
                categoria: [this.publicacion.servicios.categoriaServicio.nombreCategoria, Validators.required],
                tipo: [this.publicacion.categoria.nombreCategoria, Validators.required],
                precio: [this.publicacion.servicios.precioServicio, Validators.required],
                cantidad: [this.publicacion.servicios.cantidadDisponible, Validators.required],
                tiempoServicio: [this.publicacion.servicios.tiempoServicio, Validators.required],
                estado: [this.publicacion.estado, Validators.required],
            });
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
    /*send(): void
    {
        this.ActualizarServicio();
    }*/

    variableSer:any;
    data:any;
    servicio: ServicioModels = new ServicioModels();
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

   /* ActualizarServicio(){
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
          }*/
}
