import { CategoriaProducto } from './../../modules/emprendedora/ecommerce/inventory/inventory.types';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Destacados } from '../models/destacados';

@Injectable({
  providedIn: 'root'
})
export class FavoritosService {

  private baseUrl = 'http://localhost:8080/api/likes'; 

  constructor(private http: HttpClient) { }


  saveFavorito(favorito: Destacados): Observable<Destacados> {
    return this.http.post<Destacados>(`${this.baseUrl}/registrar`, favorito);
  }


  eliminarFavorito(idFavorito: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/eliminar/${idFavorito}`);
  }

}
