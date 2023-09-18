import { DetalleSubscripcion } from './../models/detalleSubscripcion';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { mensajeAlertasDto } from '../models/mensajeAlertasDto';

@Injectable({
  providedIn: 'root'
})
export class DetalleSubscripcionService {

  private baseUrl = 'http://localhost:8080/api/detalleSubscripcion'; // Cambia la URL a la de tu servidor

  constructor(private http: HttpClient) { }


  updateDetalleSubscripcion(id: number, detalle: DetalleSubscripcion): Observable<object> {
    return this.http.put(`${this.baseUrl}/actualizar/${id}`, detalle);
  }

  limitPost():Observable<mensajeAlertasDto>{
    return this.http.get<mensajeAlertasDto>(`${this.baseUrl}/comprobarLimite`);
  }

  limitEstatusPost():Observable<mensajeAlertasDto>{
    return this.http.get<mensajeAlertasDto>(`${this.baseUrl}/comprobarPubAct`);
  }
}
