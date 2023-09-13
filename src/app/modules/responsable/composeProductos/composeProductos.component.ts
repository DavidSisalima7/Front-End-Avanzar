import { NgIf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
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
import { ProductosService } from 'app/services/services/producto.service';
import { Productos, ProductosModels } from 'app/services/models/productos';
import Swal from 'sweetalert2';
import { Publicacion } from 'app/services/models/publicaciones';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { Vendedor } from 'app/services/models/vendedora';
@Component({
    selector     : 'mailbox-compose',
    templateUrl  : './composeProductos.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    styleUrls    : ['./composeProductos.component.scss'],

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


    @Output() confirmacionCerrada: EventEmitter<boolean> = new EventEmitter<boolean>();
    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: UntypedFormBuilder,
        private productoService: ProductosService,
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
        // Create the form
        this.composeForm = this._formBuilder.group({
                titulopubli : ['', Validators.required],
                descripcionpubli : ['', Validators.required],
                nombreProducto : ['', Validators.required],
                vendedor: ['', Validators.required],
                categoria: ['', Validators.required],
                tipo: ['', Validators.required],
                precio : ['', Validators.required],
                cantidad : ['', Validators.required],  
                peso: ['', Validators.required],
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
        this.ActualizarProducto();
    }*/

    variableProd:any;
    data:any;
    publicacion: Publicacion = new Publicacion();
    cargar_datos(){
      this.variableProd = localStorage.getItem("idProductoSelected");
      this.publicacionService.buscarPublicacionId(this.variableProd).subscribe((dataproducto) =>{
      this.data=dataproducto;
      console.log(dataproducto);
      this.publicacion.tituloPublicacion = this.data.tituloPublicacion;
      this.publicacion.descripcionPublicacion = this.data.descripcionPublicacion
      this.publicacion.productos.nombreProducto = this.data.productos.nombreProducto;
      this.publicacion.vendedor.usuario.persona.primer_nombre = this.data.nombrevendedor;
      this.publicacion.categoria.nombreCategoria = this.data.categoria;
      this.publicacion.productos.categoriaProducto.nombreCategoria = this.data.tipo;
      this.publicacion.productos.precioProducto = this.data.precio;
      this.publicacion.productos.cantidadDisponible = this.data.cantidad;
      this.publicacion.productos.pesoProducto = this.data.peso;
      this.publicacion.estado = this.data.estado ? true : false;
      })
    }
    

   /*ActualizarProducto(){
    this.productoService.actualizarProducto2(this.variableProd, this.publicacion).subscribe((data)=>{
    Swal.fire(
    'Acción Exitosa',
    'Producto Actualizado',
    'success'
          );
this.matDialogRef.close();
    }, error=>{
        console.log("Error al guardar");
    });
   }*/
}
