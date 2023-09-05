
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  url: string = 'http://localhost:8080/api/persona';
  constructor(private http: HttpClient) { }


  savePersona(persona: Persona): Observable<Persona>{
    return this.http.post<Persona>(this.url+'/registrar',persona);
  }

  buscarPersonaPorCedula(cedula: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/findByCedula/${cedula}`);
  }

  buscarPersonaPorCorreo(correo: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.url}/findByCorreo/${correo}`);
  }
  actualizarPersona(cedula: string, persona: Persona): Observable<object> {
    return this.http.put(`${this.url}/actualizar1/${cedula}`, persona);
  }
  listarPersona(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.url}/listar`);
  }
}
