import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { InventarioPublicaciones } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { PublicacionesInventory } from 'app/services/services/publicacionesInventory.service';
import { User } from 'app/core/user/user.types';
import { MatDialog } from '@angular/material/dialog';
import { ModalPublicacionComponent } from './modal-publicacion/modal-publicacion.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
;
@Component({
  selector: 'home-tienda',
  standalone: true,
  templateUrl: './home-tienda.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home-tienda.component.scss'],
  styles: [
    `
           /*  cards fuse-card {
                margin: 16px;
            } */
        `,
  ],
  imports: [AsyncPipe, NgIf, MatButtonToggleModule, FormsModule, NgFor, FuseCardComponent, MatButtonModule, MatIconModule, RouterLink, NgClass, MatMenuModule, MatCheckboxModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, TitleCasePipe],
})
export class HomeTiendaClientComponent {
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
    private _inventoryService: PublicacionesInventory,
    private _matDialog: MatDialog
  ) {
  }


  ngOnInit(): void {
    this.publicaciones$ = this._inventoryService.publicaciones$;
  }

  nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  }

  listarPublicaciones() {
    this._inventoryService.obtenerListaPublicaciones().subscribe(
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
  
    HomeTiendaClientComponent.publicacionSeleccionada = idPublicacion;
    console.log('idPublicacionSeleccionado', HomeTiendaClientComponent.publicacionSeleccionada);
  
    const dialogRef = this._matDialog.open(ModalPublicacionComponent,{
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
