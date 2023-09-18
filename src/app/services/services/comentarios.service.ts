
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Comentarios } from '../models/comentarios';
import { Usuario } from '../models/usuario';


@Injectable({
  providedIn: 'root'
})
export class ComentariosService {
  private baseUrl = 'http://localhost:8080/api/comentarios';

  constructor(private http: HttpClient) { }

  obtenerComentarios(idPublicacion: number): Observable<Comentario[]> {
    return this.http.get<Comentario[]>(`${this.baseUrl}/listar/${idPublicacion}`);
  }
}

interface Comentario {
  texto: string;
  fecha: Date;
}