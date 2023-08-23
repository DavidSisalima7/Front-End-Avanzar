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
import { MailboxComposeComponent } from 'app/modules/responsable/compose/compose.component';


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
  displayedColumns: string[] = ['nombreProducto', 'precioProducto', 'cantidaDisponible', 'estado','editar','delete'];
  dataSource: MatTableDataSource<Productos>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;



  /**
   * Constructor
   */
  constructor(private productoService: ProductosService, private _router: Router,private _matDialog: MatDialog
    ) {
  }
  ngOnInit(): void {
    this.listarRegistrosProductos();

  }
  listarRegistrosProductos() {
    this.productoService.listarProducto().subscribe(
      (datos: Productos[]) => {
        this.dataSource = new MatTableDataSource<Productos>(datos);
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
/////////////////////////Filtro de los productos
productos:any;
 ///cantidad
   FiltroCantidadAsc(): void {
     this.productoService.listarProducto().subscribe(
       (datos: Productos[]) => {
         // Ordena el array de productos por cantidad asc
         this.productos = datos.sort((a, b) => a.cantidadDisponible - b.cantidadDisponible);
         this.dataSource = new MatTableDataSource<Productos>(this.productos);
       },
       error => {
        console.error('Ocurrió un error al obtener la lista de productos:', error);
       }
     );
   }
   FiltroCantidadDesc(): void {
     this.productoService.listarProducto().subscribe(
       (datos: Productos[]) => {
         // Ordena el array de productos por cantidad en forma descendente
         this.productos = datos.sort((a, b) => b.cantidadDisponible - a.cantidadDisponible);
         this.dataSource = new MatTableDataSource<Productos>(this.productos);
       },
       error => {
        console.error('Ocurrió un error al obtener la lista de productos:', error);
       }
     );
   }
 
   //Nombre de productos
   FiltroNombreAsc(): void {
     this.productoService.listarProducto().subscribe(
       (datos: Productos[]) => {
         // Ordena el array de usuarios por el nombre acs
         this.productos = datos.sort((a, b) => a.nombreProducto.localeCompare(b.nombreProducto));
         this.dataSource = new MatTableDataSource<Productos>(this.productos);
       },
       error => {
         console.error('Ocurrió un error al obtener la lista de productos:', error);
       }
     );
   }
   FiltroNombreDesc(): void {
    this.productoService.listarProducto().subscribe(
      (datos: Productos[]) => {
        // Ordena el array de usuarios por el nombre acs
        this.productos = datos.sort((a, b) => b.nombreProducto.localeCompare(a.nombreProducto));
        this.dataSource = new MatTableDataSource<Productos>(this.productos);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de productos:', error);
      }
    );
  }

 //precio
 FiltroprecioAsc(): void {
  this.productoService.listarProducto().subscribe(
    (datos: Productos[]) => {
      // Ordena el array de productos por precio asc
      this.productos = datos.sort((a, b) => a.precioProducto - b.precioProducto);
      this.dataSource = new MatTableDataSource<Productos>(this.productos);
    },
    error => {
     console.error('Ocurrió un error al obtener la lista de productos:', error);
    }
  );
}
 FiltroprecioDesc(): void {
  this.productoService.listarProducto().subscribe(
    (datos: Productos[]) => {
      // Ordena el array de productos por el precio en forma descendente
      this.productos = datos.sort((a, b) => b.precioProducto - a.precioProducto);
      this.dataSource = new MatTableDataSource<Productos>(this.productos);
    
    },
    error => {
     console.error('Ocurrió un error al obtener la lista de productos:', error);
    }
  );
}
 FiltroEstadoActivo() {
  // Ordena el array de prodcutos por estado activo
 this.productoService.obtenerListProductoOrdenA().subscribe(
   (datos: Productos[]) => {
     this.dataSource = new MatTableDataSource<Productos>(datos);
   },
   error => {
    console.error('Ocurrió un error al obtener la lista de productos:', error);
   }
 );
}
FiltroEstadoInactivo() {
 // Ordena el array de productos por estado inactivo
 this.productoService.obtenerListProductoOrdenI().subscribe(
   (datos: Productos[]) => {
     this.dataSource = new MatTableDataSource<Productos>(datos);
   },
   error => {
    console.error('Ocurrió un error al obtener la lista de productos:', error);
   }
 );
}
  
   ejecutarPrimeraFuncion: boolean = true;
   cambiarFuncionAEjecutar(): void {
     this.ejecutarPrimeraFuncion = !this.ejecutarPrimeraFuncion;
   }
   //Nombre
   ejecutarFuncionNombre(): void {
     if (this.ejecutarPrimeraFuncion) {
       this.FiltroNombreAsc();
     } else {
       this.FiltroNombreDesc();
     }
     this.cambiarFuncionAEjecutar();
   }
   //cantidada
   ejecutarFuncionCantidad(): void {
     if (this.ejecutarPrimeraFuncion) {
       this.FiltroCantidadAsc();
     } else {
       this.FiltroCantidadDesc();
     }
     this.cambiarFuncionAEjecutar();
   }
   //precio
   ejecutarFuncionPrecio(): void {
     if (this.ejecutarPrimeraFuncion) {
       this.FiltroprecioAsc();
     } else {
       this.FiltroprecioDesc();
     }
     this.cambiarFuncionAEjecutar();
   }
   //Estado
   ejecutarFuncionEstado(): void {
     if (this.ejecutarPrimeraFuncion) {
       this.FiltroEstadoActivo();
     } else {
       this.FiltroEstadoInactivo();
     }
     this.cambiarFuncionAEjecutar();
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
          this.listarRegistrosProductos();
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


}