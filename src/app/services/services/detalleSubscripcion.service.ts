import { DetalleSubscripcion } from './../models/detalleSubscripcion';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DetalleSubscripcionService {

  private baseUrl = 'http://localhost:8080/api/detalleSubscripcion'; // Cambia la URL a la de tu servidor

  constructor(private http: HttpClient) { }


  updateDetalleSubscripcion(id: number, detalle: DetalleSubscripcion): Observable<object> {
    return this.http.put(`${this.baseUrl}/actualizar/${id}`, detalle);
  }

  limitPost():Observable<Boolean>{
    return this.http.get<Boolean>(`${this.baseUrl}/comprobarLimite`);
  }
}
