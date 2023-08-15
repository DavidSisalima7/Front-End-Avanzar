
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

}
