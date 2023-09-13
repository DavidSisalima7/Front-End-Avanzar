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
import { ProductosService } from 'app/services/services/producto.service';
import { Productos } from 'app/services/models/productos';
import Swal from 'sweetalert2';
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

    /**
     * Constructor
     */
    constructor(
        public matDialogRef: MatDialogRef<MailboxComposeComponent>,
        private _formBuilder: UntypedFormBuilder,
        private productoService: ProductosService,
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
                cantidad : ['', Validators.required],  
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
    send(): void
    {
        this.ActualizarProducto();
    }

    variableProd:any;
    data:any;
    productos: Productos = new Productos();
    cargar_datos(){
      this.variableProd = localStorage.getItem("idProductoSelected");
      this.productoService.buscarProducto(this.variableProd).subscribe((dataproducto) =>{
      this.data=dataproducto;
      this.productos.nombreProducto = this.data.nombreProducto;
      this.productos.precioProducto = this.data.precioProducto;
      this.productos.cantidadDisponible = this.data.cantidadDisponible;
      this.productos.estado = this.data.estado ? true : false;
      })
    }
    

   ActualizarProducto(){
    this.productoService.actualizarProducto2(this.variableProd, this.productos).subscribe((data)=>{
    Swal.fire(
    'Acción Exitosa',
    'Producto Actualizado',
    'success'
          );
this.matDialogRef.close();
    }, error=>{
        console.log("Error al guardar");
    });
   }
}
