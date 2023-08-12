import { Injectable } from "@angular/core";
import { Productos } from "../models/productos";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
  })
  export class ProductosService {
    private url: string = 'http://localhost:8080/api/productos';
  
    constructor(private http: HttpClient) { }
  
    saveProducto(producto: Productos): Observable<Productos> {
      return this.http.post<Productos>(`${this.url}/registrar`, producto);
    }
  
    listarProducto(): Observable<Productos[]> {
      return this.http.get<Productos[]>(`${this.url}/listar`);
    }
  
    eliminarProducto(id: number): Observable<object> {
      return this.http.delete(`${this.url}/eliminar/${id}`);
    }
  
    actualizarProducto(id: number, producto: Productos): Observable<object> {
      return this.http.put(`${this.url}/actualizar/${id}`, producto);
    }
  }