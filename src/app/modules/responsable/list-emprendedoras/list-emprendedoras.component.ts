import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProductosService } from 'app/services/services/producto.service';
import { MatButtonModule } from '@angular/material/button';
import { debounceTime, map, merge, Observable, Subject, switchMap, takeUntil } from 'rxjs';
import { Usuario } from 'app/services/models/usuario';
import { UserService } from 'app/core/user/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

//DIALOGOS
import { MatDialog } from '@angular/material/dialog';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { MailboxComposeComponent } from 'app/modules/responsable/compose/compose.component';
import { UserA } from 'app/core/user/user.types';

@Component({
  selector: 'list-emprendedoras',
  standalone: true,
  templateUrl: './list-emprendedoras.component.html',
  encapsulation: ViewEncapsulation.None,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule,
    MatIconModule, MatButtonModule, CommonModule],
})
export class ListEmprendedorasResponsableComponent {
  displayedColumns: string[] = ['cedula', 'nombres', 'correo', 'celular', 'estado', 'editar', 'delete'];
  dataSource: MatTableDataSource<Usuario>;

  pageSizeOptions: number[] = [1, 5, 10, 50]; // Opciones de tamaño de página
  pageSize: number = 10;
  static idUsuarioSeleccionado: number;


  users: Usuario[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;

  constructor(private usuarioService: UserService, private _router: Router,
    private productoService: ProductosService, private _matDialog: MatDialog, private confirmationService: FuseConfirmationService,) {
  }

  ngOnInit(): void {
    this.listarRegistros();

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

  listarRegistros() {
    this.usuarioService.obtenerListaEmprendedor().subscribe(
      (datos: Usuario[]) => {
        this.users = datos; // Asigna los datos a la propiedad users
        this.dataSource = new MatTableDataSource<Usuario>(datos);

        this.dataSource.paginator = this.paginator;
        this.paginator.length = datos.length;
        // Llama a nextPage() después de configurar el paginador
        this.nextPage();
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }


  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.toLowerCase();
    // Filtra los datos por nombre, correo, cédula y celular
    this.dataSource.filterPredicate = (data: Usuario, filter: string) => {
      const persona = data.persona;
      return (
        data.name.toLowerCase().includes(filter) ||
        data.username.toLowerCase().includes(filter) ||
        persona.cedula.toLowerCase().includes(filter) ||
        persona.celular.toLowerCase().includes(filter)
      );
    };

    this.dataSource.filter = filterValue;

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  redirectToFormEmprendedora(): void {
    this._router.navigate(['/reg-empre-resp']);
  }

  //ABRIR EL MODAL
  openComposeDialog(idUsuario: number): void {
    // Abre el diálogo y pasa el idUsuario como dato

    ListEmprendedorasResponsableComponent.idUsuarioSeleccionado = idUsuario;
    console.log('idUsuarioSeleccionado', ListEmprendedorasResponsableComponent.idUsuarioSeleccionado);

    const dialogRef = this._matDialog.open(MailboxComposeComponent);

    dialogRef.componentInstance.confirmacionCerrada.subscribe((confirmado: boolean) => {
      if (confirmado) {
        dialogRef.close(); // Cierra el diálogo
        // Realiza otras acciones aquí si es necesario
        this.listarRegistros();
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Compose dialog was closed!');
    });
  }

  selectedEmprendedora: any;
  usernameSelect: any;
  name: any;
  verficarEstado: any;
  seleccionarEmprendedora(usuario: any) {
    this.selectedEmprendedora = usuario.id;
    this.usernameSelect = usuario.username;
    this.name = usuario.name;
    this.usuarioService.BuscarUsername(this.usernameSelect).subscribe(
      (usuarioEncontrado) => {
        this.verficarEstado = usuarioEncontrado;
        console.log(this.verficarEstado);
        if (this.verficarEstado === null) {
          const confirmationDialog = this.confirmationService.open({
            title: 'Ocurrió un error',
            message: 'Acción no disponible, El usuario ya se encuentra inactivo',
            actions: {
              confirm: {
                show: true,
                label: 'OK',
                color: 'primary'
              },
              cancel: {
                show: false,
                label: 'Cancelar'
              }
            }
          });

        } else {
          const confirmationDialog = this.confirmationService.open({
            title: 'Confirmación',
            message: '¿Está seguro de desactivar a este usuario?',
            icon: {
              show: true,
              name: 'heroicons_outline:information-circle',
              color: 'info',
            },
            actions: {
              confirm: {
                show: true,
                label: 'Si estoy seguro',
                color: 'primary'
              },
              cancel: {
                show: true,
                label: 'Cancelar'
              }
            }
          });
          confirmationDialog.afterClosed().subscribe(result => {
            if (result === 'confirmed') {
              this.usuarioService.eliminadoLogico(this.selectedEmprendedora).subscribe(
                (datapersencontrada) => {

                  const usuario: UserA = {
                    id: this.selectedEmprendedora,
                    enabled: false,
                    visible: false,
                    username: this.usernameSelect,
                    name: this.name,
                  };

                  this.usuarioService.updateUserById2(this.selectedEmprendedora, usuario).subscribe(
                    (respuesta) => {
                      // Realiza alguna acción adicional si es necesario
                      this.listarRegistros();

                      const confirmationDialog = this.confirmationService.open({
                        title: 'Éxito',
                        message: 'El usuario ha sido desactivado',
                        icon: {
                          show: true,
                          name: 'heroicons_outline:check-circle',
                          color: 'success',
                        },
                        actions: {
                          confirm: {
                            show: true,
                            label: 'OK',
                            color: 'primary'
                          },
                          cancel: {
                            show: false,
                            label: 'Cancelar'
                          }
                        }
                      });
                    },
                    (error) => {
                      // Maneja el error si la actualización falla
                      console.error('Error al actualizar el estado en la base de datos', error);
                    }
                  );
                });
            } else {

            }
          });


        }
      });
  }

  ////////////////////////////////////// Inicio  Filtrados de Tabla
  usuarios: any;
  ///Cedula
  /*
  FiltroCedulaAsc(): void {
    this.usuarioService.obtenerListaEmprendedor().subscribe(
      (datos: Usuario[]) => {
        // Ordena el array de usuarios por  cedula asc
        this.usuarios = datos.sort((a, b) => a.persona.cedula.localeCompare(b.persona.cedula));
        this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }
  FiltroCedulaDesc(): void {
    this.usuarioService.obtenerListaEmprendedor().subscribe(
      (datos: Usuario[]) => {
        // Ordena el array de usuarios por cedula en forma descendente
        this.usuarios = datos.sort((a, b) => b.persona.cedula.localeCompare(a.persona.cedula));
        this.dataSource = new MatTableDataSource<Usuario>(this.usuarios);
      },
      error => {
        console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
      }
    );
  }
*/
  //celular
  FiltroCelularAsc(): void {
    this.usuarioService.obtenerListaEmprendedor().subscribe(
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
    this.usuarioService.obtenerListaEmprendedor().subscribe(
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
    this.usuarioService.obtenerListaEmprendedor().subscribe(
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
    this.usuarioService.obtenerListaEmprendedor().subscribe(
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
    this.usuarioService.obtenerListaEmprendedor().subscribe(
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
    this.usuarioService.obtenerListaEmprendedor().subscribe(
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
    this.usuarioService.obtenerListEmprendedorOrdenA().subscribe(
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
    this.usuarioService.obtenerListEmprendedorOrdenI().subscribe(
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
  /*
  ejecutarFuncionCedula(): void {
    if (this.ejecutarPrimeraFuncion) {
      this.FiltroCedulaAsc();
    } else {
      this.FiltroCedulaDesc();
    }
    this.cambiarFuncionAEjecutar();
  }*/
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

}