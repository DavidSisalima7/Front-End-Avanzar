import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable,} from 'rxjs';
import {  InventarioPublicaciones } from 'app/modules/emprendedora/ecommerce/inventory/inventory.types';
import { Usuario } from 'app/services/models/usuario';

@Injectable({providedIn: 'root'})
export class PublicacionesInventory
{
    // Private
    private _publicacion: BehaviorSubject<InventarioPublicaciones | null> = new BehaviorSubject(null);
    private _publicaciones: BehaviorSubject<InventarioPublicaciones[] | null> = new BehaviorSubject(null);
    user: Usuario;
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

   

    get publicacion$(): Observable<InventarioPublicaciones>
    {
        return this._publicacion.asObservable();
    }

    get publicaciones$(): Observable<InventarioPublicaciones[]>
    {
        return this._publicaciones.asObservable();
    }
    
   

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    listarServicio(): void {
        this._httpClient.get<InventarioPublicaciones[]>("http://localhost:8080/api/publicaciones/listar")
          .subscribe((data) => {
            this._publicaciones.next(data); // Actualiza el BehaviorSubject con los datos obtenidos
          });
      }
     

}


