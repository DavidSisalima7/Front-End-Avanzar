import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Publicacion } from '../models/publicaciones';

@Injectable({
  providedIn: 'root'
})
export class PublicacionesService {

  private baseUrl = 'http://localhost:8080/api/publicaciones'; // Cambia la URL a la de tu servidor

  constructor(private http: HttpClient) { }

  guardarPublicación(post: Publicacion): Observable<Publicacion> {
    return this.http.post<Publicacion>(`${this.baseUrl}/registrar`, post);
  }

  buscarPublicacionId(idPublicacion: any): Observable<Publicacion> {
    return this.http.get<Publicacion>(`${this.baseUrl}/buscar/${idPublicacion}`)
  }

  listarPublicaciones(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.baseUrl}/listarProducto`)
  }

  listarPublicacionesServicios(): Observable<Publicacion[]> {
    return this.http.get<Publicacion[]>(`${this.baseUrl}/listarServicio`)
  }
}
