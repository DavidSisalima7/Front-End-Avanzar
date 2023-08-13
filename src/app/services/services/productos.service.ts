import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Productos_R } from '../models/productosR';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  url: string = 'http://localhost:8080/api/productos/listar';
  constructor(private http: HttpClient) { }

  getProductos(): Observable<Productos_R[]>{
    return this.http.get<Productos_R[]>(this.url);
  }
}
