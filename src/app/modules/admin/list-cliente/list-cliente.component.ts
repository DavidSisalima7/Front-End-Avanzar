


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
import { PersonaService } from 'app/services/services/persona.service';
import { Persona } from 'app/services/models/persona';
import { Usuario } from 'app/services/models/usuario';
import { UserService } from 'app/core/user/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

//DIALOGOS
import { MatDialog } from '@angular/material/dialog';
import { MailboxComposeComponent } from 'app/modules/admin/compose/compose.component';


@Component({
  selector: 'list-cliente',
  standalone: true,
  templateUrl: './list-cliente.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, 
            MatIconModule, MatButtonModule, CommonModule],
})
export class ListAdminClienteComponent {
  displayedColumns: string[] = ['cedula','nombres', 'correo', 'celular','estado','editar','delete'];
  dataSource: MatTableDataSource<Usuario>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;
  /**
   * Constructor
   */
  constructor(private usuarioService: UserService, private _router: Router,private _matDialog: MatDialog,
    ) {
  }
  ngOnInit(): void {
    this.listarRegistros();

  }
  listarRegistros() {
    this.usuarioService.obtenerListaCliente().subscribe(
      (datos: Usuario[]) => {
        this.dataSource = new MatTableDataSource<Usuario>(datos);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }
  ////////////////////////////////////// Inicio  Filtrados de Tabla
  usuarios:any;
///Cedula
  FiltroCedulaAsc(): void {
    this.usuarioService.obtenerListaCliente().subscribe(
      (datos: Usuario[]) => {
        // Ordena el array de usuarios por  cedula asc
        this.usuarios = datos.sort((a, b) => a.persona.cedula - b.persona.cedula);
        this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }
  FiltroCedulaDesc(): void {
    this.usuarioService.obtenerListaCliente().subscribe(
      (datos: Usuario[]) => {
        // Ordena el array de usuarios por cedula en forma descendente
        this.usuarios = datos.sort((a, b) => b.persona.cedula - a.persona.cedula);
        this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }

  //celular
  FiltroCelularAsc(): void {
    this.usuarioService.obtenerListaCliente().subscribe(
      (datos: Usuario[]) => {
        // Ordena el array de usuarios por el celular acs
        this.usuarios = datos.sort((a, b) => a.persona.celular.localeCompare(b.persona.celular));
        this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }
  FiltroCelularDesc(): void {
    this.usuarioService.obtenerListaCliente().subscribe(
      (datos: Usuario[]) => {
        // Ordena el array de usuarios por el celular desc
        this.usuarios = datos.sort((a, b) => b.persona.celular.localeCompare(a.persona.celular));
        this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }
//Nombres
FiltroNombreAsc(): void {
  this.usuarioService.obtenerListaCliente().subscribe(
    (datos: Usuario[]) => {
      // Ordena el array de usuarios por el nombre asc
      this.usuarios = datos.sort((a, b) => a.name.localeCompare(b.name));
      this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
    },
    error => {
      console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
    }
  );
}
FiltroNombreDesc(): void {
  this.usuarioService.obtenerListaCliente().subscribe(
    (datos: Usuario[]) => {
      // Ordena el array de usuarios por el nombre desc
      this.usuarios = datos.sort((a, b) => b.name.localeCompare(a.name));
      this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
    },
    error => {
      console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
    }
  );
}
//Correos
FiltroCorreoAsc(): void {
  this.usuarioService.obtenerListaCliente().subscribe(
    (datos: Usuario[]) => {
      // Ordena el array de usuarios por el correo asc
      this.usuarios = datos.sort((a, b) => a.persona.correo.localeCompare(b.persona.correo));
      this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
    },
    error => {
      console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
    }
  );
}
FiltroCorreoDesc(): void {
  this.usuarioService.obtenerListaCliente().subscribe(
    (datos: Usuario[]) => {
      // Ordena el array de usuarios por el correo desc
      this.usuarios = datos.sort((a, b) => b.persona.correo.localeCompare(a.persona.correo));
      this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
    },
    error => {
      console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
    }
  );
}
  FiltroEstadoActivo() {
     // Ordena el array de usuarios por estado activo
    this.usuarioService.obtenerListClientOrdenA().subscribe(
      (datos: Usuario[]) => {
        this.dataSource = new MatTableDataSource<Usuario>(datos);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }
  FiltroEstadoInactivo() {
    // Ordena el array de usuarios por estado inactivo
    this.usuarioService.obtenerListClientOrdenI().subscribe(
      (datos: Usuario[]) => {
        this.dataSource = new MatTableDataSource<Usuario>(datos);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }
 
  ejecutarPrimeraFuncion: boolean = true;
  cambiarFuncionAEjecutar(): void {
    this.ejecutarPrimeraFuncion = !this.ejecutarPrimeraFuncion;
  }
  //Cedula
  ejecutarFuncionCedula(): void {
    if (this.ejecutarPrimeraFuncion) {
      this.FiltroCedulaAsc();
    } else {
      this.FiltroCedulaDesc();
    }
    this.cambiarFuncionAEjecutar();
  }
  //Nombres
  ejecutarFuncionNombres(): void {
    if (this.ejecutarPrimeraFuncion) {
      this.FiltroNombreAsc();
    } else {
      this.FiltroNombreDesc();
    }
    this.cambiarFuncionAEjecutar();
  }
  //Correo
  ejecutarFuncionCorreo(): void {
    if (this.ejecutarPrimeraFuncion) {
      this.FiltroCorreoAsc();
    } else {
      this.FiltroCorreoDesc();
    }
    this.cambiarFuncionAEjecutar();
  }
  //Celular
  ejecutarFuncionCelular(): void {
    if (this.ejecutarPrimeraFuncion) {
      this.FiltroCelularAsc();
    } else {
      this.FiltroCelularDesc();
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
 ////////////////////////////////////// Fin  Filtrados de Tabla

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  redirectToRegisterCliente() {
    this._router.navigate(['/register-cliente']);
  }

  selectedCliente:any;
  usernameSelect: any;
  verficarEstado: any;
  seleccionarCliente(usuario: any) {
    this.selectedCliente = usuario.id;
    this.usernameSelect = usuario.username;
    this.usuarioService.BuscarUsername(this.usernameSelect).subscribe(
      (usuarioEncontrado) => {
        this.verficarEstado=usuarioEncontrado;
      if (this.verficarEstado === null){
      Swal.fire(
        'Acción no disponible',
        'El usuario ya se encuentra inactivo',
        'error',
            );
      
      }else{
        this.usuarioService.eliminadoLogico(this.selectedCliente).subscribe(
          (datapersencontrada) => {
            this.listarRegistros();
            Swal.fire(
              'Acción Exitosa',
              'Usuario Desactivado.',
              'success'
                  );
            return;
          } );
       
      }
    });
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
}
