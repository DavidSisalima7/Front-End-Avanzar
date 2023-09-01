import { Injectable } from "@angular/core";
import { Productos, ProductosModels } from "../models/productos";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, ReplaySubject, tap, throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
  export class ProductosService {
    private url: string = 'http://localhost:8080/api/productos';
  
    constructor(private http: HttpClient) { }
    private handleError(error: any) {
      console.error('Ocurrió un error:', error);
      return throwError('Error en el servicio. Por favor, inténtalo de nuevo más tarde.');
    }

    saveProducto(producto: Productos): Observable<Productos> {
      return this.http.post<Productos>(`${this.url}/registrar`, producto);
    }
  
    listarProducto(): Observable<Productos[]> {
      return this.http.get<Productos[]>(`${this.url}/listar`);
    }
  
    buscarProductoActivo(id: number): Observable<object> {
      return this.http.get(`${this.url}/buscarProductoActivo/${id}`);
    }

    eliminadoLogico(id: any) {
      return this.http.put(`${this.url}/eliminadoLogico/${id}`, null);
    }
    actualizarProducto(id: number, producto: ProductosModels): Observable<object> {
      return this.http.put(`${this.url}/actualizar/${id}`, producto);
    }

    obtenerListProductoOrdenA(): Observable<Productos[]> {
      const url = `${this.url}/listarProductosEstadoActivo`;
      return this.http.get<Productos[]>(url)
        .pipe(
          catchError(this.handleError)
        );
    }
      obtenerListProductoOrdenI(): Observable<Productos[]> {
      const url = `${this.url}/listarProductosEstadoInactivo`;
      return this.http.get<Productos[]>(url)
        .pipe(
          catchError(this.handleError)
        );
    }

  }