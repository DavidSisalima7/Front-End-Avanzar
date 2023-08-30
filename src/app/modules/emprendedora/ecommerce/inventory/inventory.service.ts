import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, filter, map, Observable, of, switchMap, take, tap, throwError } from 'rxjs';
import { InventarioProductos, CategoriaProducto, InventoryPagination, InventarioPublicaciones, CategoriaPublicacion } from './inventory.types';

@Injectable({providedIn: 'root'})
export class InventoryService
{
    // Private
    private _product: BehaviorSubject<InventarioProductos | null> = new BehaviorSubject(null);
    private _productos: BehaviorSubject<InventarioProductos[] | null> = new BehaviorSubject(null);
    private _publicacion: BehaviorSubject<InventarioPublicaciones | null> = new BehaviorSubject(null);
    private _categoriesProducto: BehaviorSubject<CategoriaProducto[] | null> = new BehaviorSubject(null);
    private _pagination: BehaviorSubject<InventoryPagination | null> = new BehaviorSubject(null);
    private _publicaciones: BehaviorSubject<InventarioPublicaciones[] | null> = new BehaviorSubject(null);
    private _categoriesPublicacion: BehaviorSubject<CategoriaPublicacion[] | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
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
    get categoriesProducto$(): Observable<CategoriaProducto[]>
    {
        return this._categoriesProducto.asObservable();
    }

    get pagination$(): Observable<InventoryPagination>
    {
        return this._pagination.asObservable();
    }

    get product$(): Observable<InventarioProductos>
    {
        return this._product.asObservable();
    }

    get publicacion$(): Observable<InventarioPublicaciones>
    {
        return this._publicacion.asObservable();
    }

    get publicaciones$(): Observable<InventarioPublicaciones[]>
    {
        return this._publicaciones.asObservable();
    }

    get productos$(): Observable<InventarioProductos[]>
    {
        return this._productos.asObservable();
    }


    listarServicio(): void {
        this._httpClient.get<InventarioPublicaciones[]>("http://localhost:8080/api/publicaciones/listar")
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
    getCategoriesProducto(): Observable<CategoriaProducto[]>
    {
        return this._httpClient.get<CategoriaProducto[]>('http://localhost:8080/api/categoriaProducto/listar').pipe(
            tap((categories) =>
            {
                this._categoriesProducto.next(categories);
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
     *  @param page
     * @param size
     * @param sort
     * @param order
     * @param search
     */

    getProducts(
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
          .get<{ pagination: InventoryPagination; products: InventarioPublicaciones[] }>('http://localhost:8080/api/publicaciones/listar', {
            params: params
          })
          .pipe(
            map((response) => response.products),
             // Extrae solo la lista de productos
            catchError((error) => {
              console.error('Error al obtener productos', error);
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


    createPublicacion(): Observable<InventarioPublicaciones>
    {
        return this.publicaciones$.pipe(
            take(1),
            switchMap(publicaciones => this._httpClient.post<InventarioPublicaciones>('http://localhost:8080/api/publicaciones/registrar', {}).pipe(
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

    /**
     * Update product
     *
     * @param id
     * @param publicacion
     */
    updatePublicacion(id: number, publicacion: InventarioPublicaciones): Observable<InventarioPublicaciones>
    {
        return this.publicaciones$.pipe(
            take(1),
            switchMap(publicaciones => this._httpClient.patch<InventarioPublicaciones>('api/apps/ecommerce/inventory/product', {
                id,
                publicacion,
            }).pipe(
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

    /**
     * Delete the product
     *
     * @param id
     */
    deleteProduct(id: number): Observable<boolean>
    {
        return this.publicaciones$.pipe(
            take(1),
            switchMap(publicaciones => this._httpClient.delete('http://localhost:8080/api/publicaciones/eliminar/', {params: {id}}).pipe(
                map((isDeleted: boolean) =>
                {
                    // Find the index of the deleted product
                    const index = publicaciones.findIndex(item => item.idPublicacion === id);

                    // Delete the product
                    publicaciones.splice(index, 1);

                    // Update the publicaciones
                    this._publicaciones.next(publicaciones);

                    // Return the deleted status
                    return isDeleted;
                }),
            )),
        );
    }


}
