
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { CategoriaServicio, InventoryPagination, InventarioPublicaciones, CategoriaPublicacion, InventarioServicios } from './inventoryServicios.types';
import { Publicacion } from 'app/services/models/publicaciones';

@Injectable({providedIn: 'root'})
export class InventoryServiceServicios
{
    // Private
    private _servicio: BehaviorSubject<InventarioServicios | null> = new BehaviorSubject(null);
    private _servicios: BehaviorSubject<InventarioServicios[] | null> = new BehaviorSubject(null);
    private _publicacion: BehaviorSubject<InventarioPublicaciones | null> = new BehaviorSubject(null);
    private _categoriesServicio: BehaviorSubject<CategoriaServicio[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<InventoryPagination | null> = new BehaviorSubject(null);
    private _publicaciones: BehaviorSubject<InventarioPublicaciones[] | null> = new BehaviorSubject(null);
    private _categoriesPublicacion: BehaviorSubject<CategoriaPublicacion[] | null> = new BehaviorSubject(null);

    constructor(private _httpClient: HttpClient)
    {
        this.listarServicio(); // Llama a tu método para cargar los datos iniciales
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for categories
     */
    get categoriesProducto$(): Observable<CategoriaServicio[]>
    {
        return this._categoriesServicio.asObservable();
    }

    get pagination$(): Observable<InventoryPagination>
    {
        return this._pagination.asObservable();
    }

    get servicio$(): Observable<InventarioServicios>
    {
        return this._servicio.asObservable();
    }

    get publicacion$(): Observable<InventarioPublicaciones>
    {
        return this._publicacion.asObservable();
    }

    get publicaciones$(): Observable<InventarioPublicaciones[]>
    {
        return this._publicaciones.asObservable();
    }

    get servicios$(): Observable<InventarioServicios[]>
    {
        return this._servicios.asObservable();
    }


    listarServicio(): void {
        this._httpClient.get<InventarioPublicaciones[]>("http://localhost:8080/api/publicaciones/listaPublicacionesXServicios")
          .subscribe((data) => {
            this._publicaciones.next(data); // Actualiza el BehaviorSubject con los datos obtenidos
          });
      }

    get categoriesPublicacion$(): Observable<CategoriaPublicacion[]>
    {
        return this._categoriesPublicacion.asObservable();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get categories
     */
    getCategoriesServicio(): Observable<CategoriaServicio[]>
    {
        return this._httpClient.get<CategoriaServicio[]>('http://localhost:8080/api/categoriaServicio/listar').pipe(
            tap((categories) =>
            {
                this._categoriesServicio.next(categories);
            }),
        );
    }

    getCategoriesPublicacion(): Observable<CategoriaPublicacion[]>
    {
        return this._httpClient.get<CategoriaPublicacion[]>('http://localhost:8080/api/categoria/listar').pipe(
            tap((categories) =>
            {
                this._categoriesPublicacion.next(categories);
            }),
        );
    }

    /**
     * Get publicationes
     *
     *
     * @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */

    getPublicacionesServicios(
        page: number = 0,
        size: number = 10,
        sort: string = 'tituloPublicacion',
        order: 'asc' | 'desc' | '' = 'asc',
        search: string = ''
      ): Observable<InventarioPublicaciones[]> {
        // Construir los parámetros de la solicitud HTTP
        const params = new HttpParams()
          .set('page', '' + page)
          .set('size', '' + size)
          .set('sort', sort)
          .set('order', order)
          .set('search', search);
      
        return this._httpClient
          .get<{ pagination: InventoryPagination; servicios: InventarioPublicaciones[] }>('http://localhost:8080/api/publicaciones/listar', {
            params: params
          })
          .pipe(
            map((response) => response.servicios),
             // Extrae solo la lista de productos
            catchError((error) => {
              console.error('Error al obtener publicaciones de servicios', error);
              return throwError(error); // Propaga el error hacia arriba
            })
          );
      }
      
    
    

    /**
     * Get product by id
     */
    getPublicacionById(id: number): Observable<InventarioPublicaciones>
    {
        return this._publicaciones.pipe(
            take(1),
            map((publicaciones) =>
            {
                // Find the product
                const publicacion = publicaciones.find(item => item.idPublicacion === id) || null;

                // Update the publicacion
                this._publicacion.next(publicacion);

                // Return the publicacion
                return publicacion;
            }),
            switchMap((publicacion) =>
            {
                if ( !publicacion )
                {
                    return throwError('Could not found publicacion with id of ' + id + '!');
                }

                return of(publicacion);
            }),
        );
    }


    createPublicacion(publicacion:InventarioPublicaciones,files: any|null): Observable<InventarioPublicaciones>
    {
        const formData: FormData = new FormData();
        formData.append('publicacion', JSON.stringify(publicacion));
    
        if (files && files.length > 0) {
          for (const file of files) {
            formData.append('files', file, file.name);
          }
        }
    
        const headers = new HttpHeaders();
        headers.append('Content-Type', 'multipart/form-data'); //para que se acepten archivos multipart file

        return this.publicaciones$.pipe(
            take(1),
            switchMap(publicaciones => this._httpClient.post<InventarioPublicaciones>('http://localhost:8080/api/publicaciones/registrarConFoto', formData, { headers: headers }).pipe(
                map((newPublicacion) =>
                {
                    // Update the products with the new product
                    this._publicaciones.next([newPublicacion, ...publicaciones]);

                    // Return the new product
                    return newPublicacion;
                }),
            )),
        );
    } 

    updatePublicacion(id: number, publicacion: InventarioPublicaciones): Observable<InventarioPublicaciones>
    {
        return this.publicaciones$.pipe(
            take(1),
            switchMap(publicaciones => this._httpClient.put<InventarioPublicaciones>(`http://localhost:8080/api/publicaciones/actualizar/${id}`,publicacion
            ).pipe(
                map((updatedPublicacion) =>
                {
                    // Find the index of the updated product
                    const index = publicaciones.findIndex(item => item.idPublicacion === id);

                    // Update the product
                    publicaciones[index] = updatedPublicacion;

                    // Update the publicaciones
                    this._publicaciones.next(publicaciones);

                    // Return the updated product
                    return updatedPublicacion;
                }),
                switchMap(updatedPublicacion => this.publicacion$.pipe(
                    take(1),
                    filter(item => item && item.idPublicacion === id),
                    tap(() =>
                    {
                        // Update the product if it's selected
                        this._publicacion.next(updatedPublicacion);

                        // Return the updated product
                        return updatedPublicacion;
                    }),
                )),
            )),
        );
    }

    
    deletePublicacion(id: number): Observable<boolean> {
        return this._httpClient.put<boolean>(`http://localhost:8080/api/publicaciones/eliminar/${id}`,null).pipe(
            switchMap(isDeleted => {
                if (isDeleted) {
                    // Eliminación exitosa, actualiza la lista
                    return this.publicaciones$.pipe(
                        take(1),
                        map(publicaciones => {
                            const index = publicaciones.findIndex(item => item.idPublicacion === id);
                            if (index !== -1) {
                                publicaciones.splice(index, 1);
                                this._publicaciones.next(publicaciones);
                            }
                            return true; // Retorna true si se eliminó correctamente de la lista
                        })
                    );
                } else {
                    // No se pudo eliminar
                    return of(false);
                }
            })
        );
    }
    


}


