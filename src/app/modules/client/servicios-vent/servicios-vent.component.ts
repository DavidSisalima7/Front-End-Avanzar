import { Component, OnInit, ViewEncapsulation ,ViewChild} from '@angular/core';
import {MatPaginator, } from '@angular/material/paginator';
import {MatTableDataSource, } from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { User } from 'app/core/user/user.types';
import { Observable } from 'rxjs';
import { InventarioPublicaciones } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { MatDialog } from '@angular/material/dialog';
import { ModalPublicacionComponent } from '../home-tienda/modal-publicacion/modal-publicacion.component';
import { AsyncPipe, NgClass, NgFor, NgIf, NgOptimizedImage, TitleCasePipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';
import { FuseCardComponent } from '@fuse/components/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PublicacionesInventoryServicios } from 'app/services/services/PublicacionesInventory-Servicios.service';
import { ModalPublicacionServiciosComponent } from './modal-publicacion-servicios/modal-publicacion-servicios.component';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module

@Component({
  selector: 'servicios-vent',
 
  templateUrl: './servicios-vent.component.html',
  styleUrls: ['../home-tienda/home-tienda.component.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [NgOptimizedImage,AsyncPipe,NgxPaginationModule, NgIf, MatButtonToggleModule, FormsModule, NgFor, FuseCardComponent, MatButtonModule, MatIconModule, RouterLink, NgClass, MatMenuModule, MatCheckboxModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, TitleCasePipe],
 
})
export class ServiciosVentClientComponent implements OnInit {
  user: User;
  publicaciones$: Observable<InventarioPublicaciones[]>;
  currentImageIndex: [0];
  static publicacionSeleccionada: number;
  publications:InventarioPublicaciones[]=[];
  dataSource: MatTableDataSource<InventarioPublicaciones>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  publicacionesOriginales: any[] = [];
  publicacionesFiltradas: any[] = [];
  public page!:number;

  /**
   * Constructor
   */
  constructor(
    private _inventoryService: PublicacionesInventoryServicios,
    private _matDialog: MatDialog
  ) {
  }


  ngOnInit(): void {
    this.publicaciones$ = this._inventoryService.publicaciones$;
    this.publicaciones$.subscribe((publicaciones) => {
      this.publicacionesOriginales = publicaciones;
      this.publicacionesFiltradas = publicaciones;
    });
  }
  buscarPublicaciones(textoBusqueda: string) {
    const busqueda = textoBusqueda.trim().toLowerCase();
  
    if (busqueda === '') {
      this.publicacionesFiltradas = this.publicacionesOriginales;
    } else {
      this.publicacionesFiltradas = this.publicacionesOriginales.filter((publicacion) => {
        return (
          publicacion.tituloPublicacion.toLowerCase().includes(busqueda) ||
          publicacion.descripcionPublicacion.toLowerCase().includes(busqueda)||
          publicacion.servicios?.nombreServicio.toLowerCase().includes(busqueda)||
          publicacion.servicios?.descripcionServicio.toLowerCase().includes(busqueda)
        );
      });
    }
  }
  
  nextPage() {
    if (this.paginator.hasNextPage()) {
      this.paginator.nextPage();
    }
  }

  listarPublicaciones() {
    this._inventoryService.obtenerListaPublicacionesXServicio().subscribe(
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
  
    ServiciosVentClientComponent.publicacionSeleccionada = idPublicacion;
    console.log('idPublicacionSeleccionado-SERVICIOS', ServiciosVentClientComponent.publicacionSeleccionada);
  
    const dialogRef = this._matDialog.open(ModalPublicacionServiciosComponent,{
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