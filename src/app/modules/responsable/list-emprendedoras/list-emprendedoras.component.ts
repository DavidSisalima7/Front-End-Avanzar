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

@Component({
    selector     : 'list-emprendedoras',
    standalone   : true,
    templateUrl  : './list-emprendedoras.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, 
      MatIconModule, MatButtonModule, CommonModule],
})
export class ListEmprendedorasResponsableComponent
{
  displayedColumns: string[] = ['idUsuario', 'nombreUsuario', 'correoUsuario', 'estado'];
  dataSource: MatTableDataSource<Usuario>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  searchInputControl: UntypedFormControl = new UntypedFormControl();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  isLoading: boolean = false;


    /**
     * Constructor
     */

    constructor(private usuarioService: UserService, private _router: Router,)
    {
    }
    ngOnInit(): void {
      this.listarUsuariosEmp();
  
    }
    listarUsuariosEmp() {
      this.usuarioService.obtenerListaEmprendedor().subscribe(
        (datos: Usuario[]) => {
          this.dataSource = new MatTableDataSource<Usuario>(datos);
        },
        error => {
          console.error('Ocurrió un error al obtener la lista de personas responsables:', error);
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


      redirectToFormEmprendedora(): void {
        this._router.navigate(['/reg-empre-resp']);
    }

}
export class ProductoData {
    idProducto: number;
    nombreProducto: string='';
    precioProducto: number;
    cantidadDisponible: number;
    estado: boolean;
}

