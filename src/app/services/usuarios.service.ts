
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from './models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url: string = 'http://localhost:8080/api/usuarios';
  constructor(private http: HttpClient) { }

  /*

  // Método para registrar un nuevo usuario
  registrarUsuario(usuario: Usuario, rolId: number): Observable<Usuario> {
    const url = `${this.url}/registrar/${rolId}`;
    return this.http.post<Usuario>(url, usuario);
  }*/
  


}
