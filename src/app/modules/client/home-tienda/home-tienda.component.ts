import { FavoritosService } from './../../../services/services/favoritos.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, TitleCasePipe } from '@angular/common';
import { Component, AfterViewInit, ChangeDetectionStrategy, ElementRef, QueryList, Renderer2, ViewChildren, ViewEncapsulation , ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
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
import { PublicacionesService } from 'app/services/services/publicaciones.service';
import { Destacados } from 'app/services/models/destacados';
import { Publicacion, PublicacionA } from 'app/services/models/publicaciones';
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

  @ViewChildren(FuseCardComponent, {read: ElementRef}) private _fuseCards: QueryList<ElementRef>;

  public comentariosVisible: boolean = false;
  user: User;
  publicaciones$: Observable<InventarioPublicaciones[]>;
  currentImageIndex: [0];
  static publicacionSeleccionada: number;
  publications:InventarioPublicaciones[]=[];
  dataSource: MatTableDataSource<InventarioPublicaciones>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  filters: string[] = ['all', 'article', 'listing', 'list', 'info', 'shopping', 'pricing', 'testimonial', 'post', 'interactive'];
  numberOfCards: any = {};
  selectedFilter: string = 'all';
  esFavorito: boolean = false;
  destacados: Destacados;
  destacadoCreated: any;


  /**
   * Constructor
   */
  constructor(
    private _inventoryService: PublicacionesInventory,
    private _matDialog: MatDialog,
    private renderer: Renderer2,
    private _favoritoService: FavoritosService,
    private _publicacionesService: PublicacionesService
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

  toggleFavorito(idPublicacion: number) {
    if (!this.esFavorito) {
      // Acción cuando se hace clic por primera vez

      const userJSON = localStorage.getItem('user');
      const user = JSON.parse(userJSON);

      console.log('idPublicacionSeleccionado', idPublicacion);
      
      this._publicacionesService.buscarPublicacionId(idPublicacion).subscribe(
        (datos: InventarioPublicaciones) => {
          console.log('datos', datos);

          this.destacados = new Destacados();
          this.destacados.estadoDestacado = true;
          this.destacados.fecha = new Date().toISOString();
          this.destacados.publicaciones = datos;
          this.destacados.usuario = user;

          console.log('destacados', this.destacados);

          this._favoritoService.saveFavorito(this.destacados).subscribe(
            (datos: Destacados) => {
              console.log('datos', datos);
              this.destacadoCreated = datos;

            },
            error => {
              console.error('Ocurrió un error al guardar el favorito:', error);
            }
          );
        },
        error => {
          console.error('Ocurrió un error al obtener la lista:', error);
        }
      );
        

      // Realiza la acción que desees aquí
    } else {
      // Acción cuando se hace clic después de haber sido clickeado
      console.log('Botón clickeado después de haber sido clickeado');
      // Realiza otra acción que desees aquí
      console.log('ID Des', this.destacadoCreated.idDestacado);

    }
    
  
    this.esFavorito = !this.esFavorito; // Cambia el estado del botón
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

 

  
  toggleComentarios(publicacion: any) {
    publicacion.mostrarComentarios = !publicacion.mostrarComentarios;
  }
  




  
}
