import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class ComentarioService {

    private baseUrl='http://localhost:8080/api/comentarios';

   

}