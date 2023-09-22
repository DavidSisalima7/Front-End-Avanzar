import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Comentario } from '../models/comentario';
import { ComentariosDto } from '../models/comentariosDto';
@Injectable({
    providedIn: 'root'
})
export class ComentarioService {

    private baseUrl='http://localhost:8080/api/comentarios';
    constructor(private http: HttpClient) { }

   createCommit(c:Comentario):Observable<Comentario>{
    const url=`${this.baseUrl}/registrar`;
    return this.http.post<Comentario>(url,c);
   }

   listCommentsPubli(idPubli:number, page: number):Observable<ComentariosDto[]>{
    return this.http.get<ComentariosDto[]>(`${this.baseUrl}/listCommentP/${idPubli}/${page}`);
   }
}