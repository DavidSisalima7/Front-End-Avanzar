
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Persona } from '../models/persona';
import { Usuario } from '../models/usuario';
import { User } from 'app/core/user/user.types';


@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  url: string = 'http://localhost:8080/api/persona';
  constructor(private http: HttpClient) { }


  savePersona(persona: Persona): Observable<Persona>{
    return this.http.post<Persona>(this.url+'/registrar',persona);
  }

  actualizarPersona(idPersona: any, persona: Persona): Observable<Persona> { 
    return this.http.put<Persona>(`${this.url}/actualizar/${idPersona}`, persona);
  }
  
  actualizarName(id: any, user: User): Observable<any> { 
    return this.http.put<User>(`${this.url}/actualizarP/${id}`, user);
  }
  

}
