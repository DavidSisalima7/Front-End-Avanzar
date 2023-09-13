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
import { MailboxComposeComponent } from 'app/modules/responsable/composeServicios/composeServicios.component';
import { Publicacion } from 'app/services/models/publicaciones';
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { ServiciosService } from 'app/services/services/servicios.service';


@Component({
    selector     : 'list-servicios',
    standalone   : true,
    templateUrl  : './list-servicios.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,
        MatIconModule, MatButtonModule, CommonModule],
})
export class ListRespServiciosComponent

{
  displayedColumns: string[] = ['nombreProducto', 'precioProducto', 'cantidaDisponible','vendedor', 'estado','editar','delete'];
  dataSource: MatTableDataSource<Publicacion>;


  pageSizeOptions: number[] = [1, 5, 10, 50]; // Opciones de tamaño de página
  pageSize: number = 10;



  publicacion: Publicacion[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;
  constructor(private publicacionService: PublicacionesService, private _router: Router,private _matDialog: MatDialog
   ,private serviciosService: ServiciosService ) {
  }
  ngOnInit(): void {
    this.listarRegistrosServicios();

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

  listarRegistrosServicios() {
    this.publicacionService.listarPublicacionesServicios().subscribe(
      (datos: Publicacion[]) => {
        this.publicacion = datos;
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
/////////////////////////Filtro de los Servicios
/*servicios:any;
 ///descripcion
   FiltroDescripcionAsc(): void {
     this.serviciosService.listarServicio().subscribe(
       (datos: Servicios[]) => {
         // Ordena el array de Servicios por decsripcion asc
         this.servicios = datos.sort((a, b) => a.descripcionServicio.localeCompare(b.descripcionServicio));
         this.dataSource = new MatTableDataSource<Servicios>(this.servicios);
       },
       error => {
        console.error('Ocurrió un error al obtener la lista de Servicios:', error);
       }
     );
   }
   FiltroDescripcionDesc(): void {
     this.serviciosService.listarServicio().subscribe(
       (datos: Servicios[]) => {
         // Ordena el array de Servicios por descripcion en forma descendente
         this.servicios = datos.sort((a, b) => a.descripcionServicio.localeCompare(b.descripcionServicio));
         this.dataSource = new MatTableDataSource<Servicios>(this.servicios);
       },
       error => {
        console.error('Ocurrió un error al obtener la lista de Servicios:', error);
       }
     );
   }
 
   //Nombre de productos
   FiltroNombreAsc(): void {
     this.serviciosService.listarServicio().subscribe(
       (datos: Servicios[]) => {
         // Ordena el array de Servicios por el nombre acs
         this.servicios = datos.sort((a, b) => a.nombreServicio.localeCompare(b.nombreServicio));
         this.dataSource = new MatTableDataSource<Servicios>(this.servicios);
       },
       error => {
         console.error('Ocurrió un error al obtener la lista de Servicios:', error);
       }
     );
   }
   FiltroNombreDesc(): void {
    this.serviciosService.listarServicio().subscribe(
      (datos: Servicios[]) => {
        // Ordena el array de Servicios por el nombre acs
        this.servicios = datos.sort((a, b) => b.nombreServicio.localeCompare(a.nombreServicio));
        this.dataSource = new MatTableDataSource<Servicios>(this.servicios);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de Servicios:', error);
      }
    );
  }

 //precio
 FiltroprecioAsc(): void {
  this.serviciosService.listarServicio().subscribe(
    (datos: Servicios[]) => {
      // Ordena el array de Servicios por precio asc
      this.servicios = datos.sort((a, b) => a.precioServicio - b.precioServicio);
      this.dataSource = new MatTableDataSource<Servicios>(this.servicios);
    },
    error => {
     console.error('Ocurrió un error al obtener la lista de Servicios:', error);
    }
  );
}
 FiltroprecioDesc(): void {
  this.serviciosService.listarServicio().subscribe(
    (datos: Servicios[]) => {
      // Ordena el array de Servicios por el precio en forma descendente
      this.servicios = datos.sort((a, b) => b.precioServicio - a.precioServicio);
      this.dataSource = new MatTableDataSource<Servicios>(this.servicios);
    
    },
    error => {
     console.error('Ocurrió un error al obtener la lista de Servicios:', error);
    }
  );
}
 FiltroEstadoActivo() {
  // Ordena el array de Servicios por estado activo
 this.serviciosService.obtenerListServicioOrdenA().subscribe(
   (datos: Servicios[]) => {
     this.dataSource = new MatTableDataSource<Servicios>(datos);
   },
   error => {
    console.error('Ocurrió un error al obtener la lista de Servicios:', error);
   }
 );
}
FiltroEstadoInactivo() {
 // Ordena el array de Servicios por estado inactivo
 this.serviciosService.obtenerListServicioOrdenI().subscribe(
   (datos: Servicios[]) => {
     this.dataSource = new MatTableDataSource<Servicios>(datos);
   },
   error => {
    console.error('Ocurrió un error al obtener la lista de Servicios:', error);
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
   ejecutarFuncionDescripcion(): void {
     if (this.ejecutarPrimeraFuncion) {
       this.FiltroDescripcionAsc();
     } else {
       this.FiltroDescripcionDesc();
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
*/

///////////////////////// Fin de filtro

////////eliminado lógico de servicios
selectedServivio:any;
productSelect: any;
verficarEstado: any;
seleccionarServicio(servicio: any) {
  this.selectedServivio = servicio.idServicio;
  this.serviciosService.buscarServicioActivo(this.selectedServivio).subscribe(
    (servicioEncontrado) => {
      this.verficarEstado=servicioEncontrado;
    if (this.verficarEstado === null){
    Swal.fire(
      'Acción no disponible',
      'El servicio ya se encuentra inactivo',
      'error',
          );
    
    }else{
      this.serviciosService.eliminadoLogico(this.selectedServivio).subscribe(
        (dataservencontrada) => {
          this.listarRegistrosServicios();
          Swal.fire(
            'Acción Exitosa',
            'Servicio Eliminado.',
            'success'
                );
          return;
        } );
     
    }
  });
}
//////////////////////////////llevar datos al compose
selectService:any;
seleccionarServiceEdit(servicio: any) {
  this.openComposeDialog();
  this.selectService = servicio.idServicio;
  localStorage.setItem("idServiceSelected", String(servicio.idServicio));
}

}