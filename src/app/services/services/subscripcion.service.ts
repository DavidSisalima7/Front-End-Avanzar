import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Subscripcion } from '../models/subscripcion';

@Injectable({
  providedIn: 'root'
})
export class SubscripcionService {

  private baseUrl = 'http://evamarket.ec:8080/api/subscripcion'; // Cambia la URL a la de tu servidor

  constructor(private http: HttpClient) { }
  
  SubcripciónById(idDetalle: any): Observable<Subscripcion> {
    return this.http.get<Subscripcion>(`${this.baseUrl}/buscar/${idDetalle}`)
  }
}
