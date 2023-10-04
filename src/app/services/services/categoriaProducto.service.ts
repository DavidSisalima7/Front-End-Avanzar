import { CategoriaProducto } from './../../modules/emprendedora/ecommerce/inventory/inventory.types';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriaProductoService {

  private baseUrl = 'http://157.245.222.178:8080/api/categoriaProducto'; 

  constructor(private http: HttpClient) { }


  getCategoriaProducto(idCategoria: any): Observable<CategoriaProducto> {
    return this.http.get<CategoriaProducto>(`${this.baseUrl}/buscar/${idCategoria}`)
  }

}
