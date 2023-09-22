import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'app/core/user/user.types';
import { InventarioPublicaciones } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { Observable } from 'rxjs';
import { HomeTiendaClientComponent } from '../home-tienda/home-tienda.component';
import { ModalPublicacionComponent } from '../home-tienda/modal-publicacion/modal-publicacion.component';
import { PublicacionInventoryDestacadosService } from 'app/services/services/publicacion-inventory-destacados.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AsyncPipe, NgIf, NgFor, NgClass, TitleCasePipe, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';
import { ModalDestacadosComponent } from './modal-destacados/modal-destacados.component';

@Component({
    selector     : 'favoritos',
    standalone   : true,
    templateUrl  : './favoritos.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [NgOptimizedImage,AsyncPipe, NgIf, MatButtonToggleModule, FormsModule, NgFor, FuseCardComponent, MatButtonModule, MatIconModule, RouterLink, NgClass, MatMenuModule, MatCheckboxModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, TitleCasePipe],
})
export class FavoritosClientComponent
{
    user: User;
    publicaciones$: Observable<InventarioPublicaciones[]>;
    currentImageIndex: [0];
    static publicacionSeleccionada: number;
    publications:InventarioPublicaciones[]=[];
    dataSource: MatTableDataSource<InventarioPublicaciones>;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    
  
  
  
    /**
     * Constructor
     */
    constructor(
      private _destacadoService: PublicacionInventoryDestacadosService,
      private _matDialog: MatDialog
    ) {
    }
  
  
    ngOnInit(): void {
      this.publicaciones$ = this._destacadoService.publicaciones$;
    }
  
    nextPage() {
      if (this.paginator.hasNextPage()) {
        this.paginator.nextPage();
      }
    }
  
    listarPublicaciones() {
        this._destacadoService.obtenerListaPublicaciones().subscribe(
          (datos: InventarioPublicaciones[]) => {
            this.publications = datos; // Asigna los datos a la propiedad users
            this.dataSource = new MatTableDataSource<InventarioPublicaciones>(datos);
    
            this.dataSource.paginator = this.paginator;
            this.paginator.length = datos.length;
            // Llama a nextPage() después de configurar el paginador
            this.nextPage();
          },
          error => {
            console.error('Ocurrió un error al obtener la lista:', error);
          }
        );
      }
  
    //ABRIR EL MODAL
    openComposeDialog(idPublicacion: number): void {
      // Abre el diálogo y pasa el idUsuario como dato
    
      FavoritosClientComponent.publicacionSeleccionada = idPublicacion;
      console.log('idPublicacionSeleccionado', FavoritosClientComponent.publicacionSeleccionada);
    
      const dialogRef = this._matDialog.open(ModalDestacadosComponent,{
        data: { idPublicacion: idPublicacion },
      });
    
      dialogRef.componentInstance.confirmacionCerrada.subscribe((confirmado: boolean) => {
        if (confirmado) {
          dialogRef.close(); // Cierra el diálogo
          // Realiza otras acciones aquí si es necesario
          this.listarPublicaciones();
        }
      });
    
      dialogRef.afterClosed().subscribe((result) => {
        console.log('Compose dialog was closed!');
      });
    }
}
