import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Productos } from 'app/services/models/productos';
import { ProductosService } from 'app/services/services/producto.service';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';


//DIALOGOS
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from 'app/modules/responsable/composeProductos/composeProductos.component';
import { PublicacionesInventory } from 'app/services/services/publicacionesInventory.service';
import { Publicacion } from 'app/services/models/publicaciones';
import { PublicacionesService } from 'app/services/services/publicaciones.service';


@Component({
    selector     : 'list-emprendedoras',
    standalone   : true,
    templateUrl  : './list-productos.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,
      MatIconModule, MatButtonModule, CommonModule],
})
export class ListProductosResponsableComponent
{
  displayedColumns: string[] = ['nombreProducto', 'precioProducto', 'cantidaDisponible','vendedor', 'estado','editar','delete'];
  dataSource: MatTableDataSource<Publicacion>;

  pageSizeOptions: number[] = [1, 5, 10, 50]; // Opciones de tamaño de página
  pageSize: number = 10;

  products: Productos[] = [];
  publicacion: Publicacion[] = [];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;



  /**
   * Constructor
   */
  constructor(private productoService: ProductosService, private _router: Router,private _matDialog: MatDialog,
    private publicacionService: PublicacionesService
    ) {
  }
  ngOnInit(): void {
    this.listarPublicaciones();

  }

  cambioTamanioPagina(event) {
    this.paginator.pageIndex = event.pageIndex;
    // También puedes agregar un console.log() aquí para depurar
  }
  
  nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  }


  listarPublicaciones() {
    this.publicacionService.listarPublicaciones().subscribe(
      (datos: Publicacion[]) => {
        this.publicacion = datos; // Asigna los datos a la propiedad users
        this.dataSource = new MatTableDataSource<Publicacion>(datos);

        this.dataSource.paginator = this.paginator;
        this.paginator.length = datos.length;
        // Llama a nextPage() después de configurar el paginador
        this.nextPage();
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de los productos:', error);
      }
    );
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  redirectToRegisterProductos() {
    this._router.navigate(['/register-productos']);
  }


  //ABRIR EL MODAL
  openComposeDialog(): void
    {
        // Open the dialog
        const dialogRef = this._matDialog.open(MailboxComposeComponent);

        dialogRef.afterClosed()
            .subscribe((result) =>
            {
                console.log('Compose dialog was closed!');
            });
    }


///////////////////////// Fin de filtro

////////eliminado lógico de productos
selectedProducto:any;
productSelect: any;
verficarEstado: any;
seleccionarProducto(producto: any) {
  this.selectedProducto = producto.idProducto;
  this.productoService.buscarProductoActivo(this.selectedProducto).subscribe(
    (productoEncontrado) => {
      this.verficarEstado=productoEncontrado;
    if (this.verficarEstado === null){
    Swal.fire(
      'Acción no disponible',
      'El producto ya se encuentra inactivo',
      'error',
          );
    
    }else{
      this.productoService.eliminadoLogico(this.selectedProducto).subscribe(
        (dataprodencontrada) => {
          this.listarPublicaciones();
          Swal.fire(
            'Acción Exitosa',
            'Producto Eliminado.',
            'success'
                );
          return;
        } );
     
    }
  });
}
//////////////////////////////llevar datos al compose
  selectProducto:any;
  seleccionarProductoEdit(publicacion: any) {
    console.log('Se seleccionó el producto:', publicacion);
    this.openComposeDialog();
    this.selectProducto = publicacion.idPrublicacion;
    localStorage.setItem("idProductoSelected", String(publicacion.idPublicacion));
  }
}