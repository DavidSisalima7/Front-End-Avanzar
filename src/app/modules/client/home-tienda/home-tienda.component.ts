import { FavoritosService } from './../../../services/services/favoritos.service';
import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass, NgFor, NgOptimizedImage, TitleCasePipe } from '@angular/common';
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
import { ModalComentariosComponent } from './modal-comentarios/modal-comentarios.component';
import { ComentarioService } from 'app/services/services/comentarios.service';



@Component({
  selector: 'home-tienda',
  standalone: true,
  templateUrl: './home-tienda.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./home-tienda.component.scss'],
  styles: [
    `
             cards fuse-card {
                margin: 16px;
            } 
        `,
  ],
  imports: [NgOptimizedImage,AsyncPipe, NgIf, MatButtonToggleModule, FormsModule, NgFor, FuseCardComponent, MatButtonModule, MatIconModule, RouterLink, NgClass, MatMenuModule, MatCheckboxModule, MatProgressBarModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, TitleCasePipe],
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
  publicacionesOriginales: any[] = [];
  publicacionesFiltradas: any[] = [];
  mostrarHistorial = false;
  /**
   * Constructor
   */
  constructor(
    private _inventoryService: PublicacionesInventory,
    private _matDialog: MatDialog,
    private _favoritoService: FavoritosService,
    private _publicacionesService: PublicacionesService,
    private _commitService: ComentarioService,
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
          publicacion.productos?.nombreProducto.toLowerCase().includes(busqueda)||
          publicacion.productos?.descripcionProducto.toLowerCase().includes(busqueda)||
          publicacion.servicios?.nombreServicio.toLowerCase().includes(busqueda)||
          publicacion.servicios?.descripcionServicio.toLowerCase().includes(busqueda)
        );
      } );
      this.mostrarHistorial = false;
    }
  }
  
  buscarProductos() {
    const busquedaP = "productos";
      this.publicacionesFiltradas = this.publicacionesOriginales.filter((publicacion) => {
        return (
          publicacion.categoria?.nombreCategoria.toLowerCase().includes(busquedaP)
        );
      });
  }
  buscartodo() {
    this.publicacionesFiltradas = this.publicacionesOriginales;
  }
  buscarServicios(){
    const busquedaS = "servicios";
    this.publicacionesFiltradas = this.publicacionesOriginales.filter((publicacion) => {
      return (
        publicacion.categoria?.nombreCategoria.toLowerCase().includes(busquedaS)
      );
    });
  }
  buscarGastronomia(){
    const busquedaG = "gastronomia";
    this.publicacionesFiltradas = this.publicacionesOriginales.filter((publicacion) => {
      return (
        publicacion.categoria?.nombreCategoria.toLowerCase().includes(busquedaG)
      );
    });
  }

  public historial: string[] = [];
  public textoBusqueda: string = '';

  historialBusqueda() {
    const busqueda = this.textoBusqueda.trim().toLowerCase();
    if (busqueda !== '' && !this.historial.includes(busqueda)) {
        this.historial.push(busqueda);
        this.mostrarHistorial = true;
        setTimeout(() => {
          this.mostrarHistorial = false;
          this.textoBusqueda="";
        }, 5000);
      
    }
  }
  cerrarHistorial(){
    this.mostrarHistorial = false;
    setTimeout(() => {
      this.textoBusqueda="";
    }, 5000);
  }

  seleccionarTermino(termino: string) {
    this.textoBusqueda = termino;
    this.historialBusqueda();
  }
  eliminarTermino(termino: string) {
    this.historial = this.historial.filter(item => item !== termino);
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

  openComposecomments(idPublicacion: number){
    const dialogRef = this._matDialog.open(ModalComentariosComponent,{
      data: { idPubli: idPublicacion },
    });
    

  }

  
  toggleComentarios(publicacion: any) {
    publicacion.mostrarComentarios = !publicacion.mostrarComentarios;
  }
  




  
}
