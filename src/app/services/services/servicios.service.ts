import { Injectable } from "@angular/core";
import { Servicios } from "../models/servicios";
import { HttpClient } from "@angular/common/http";
import { catchError, map, Observable, ReplaySubject, tap, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private url: string = 'http://localhost:8080/api/servicios';

  constructor(private http: HttpClient) { }
  private handleError(error: any) {
    console.error('Ocurrió un error:', error);
    return throwError('Error en el servicio. Por favor, inténtalo de nuevo más tarde.');
  }
  saveServicio(servicio: Servicios): Observable<Servicios> {
    return this.http.post<Servicios>(`${this.url}/registrar`, servicio);
  }

  listarServicio(): Observable<Servicios[]> {
    return this.http.get<Servicios[]>(`${this.url}/listar`);
  }

  eliminarServicio(id: number): Observable<object> {
    return this.http.delete(`${this.url}/eliminar/${id}`);
  }

  actualizarServicio(id: number, servicio: Servicios): Observable<object> {
    return this.http.put(`${this.url}/actualizar/${id}`, servicio);
  }
  buscarServicioActivo(id: number): Observable<object> {
    return this.http.get(`${this.url}/buscarServicioActivo/${id}`);
  }

  eliminadoLogico(id: any) {
    return this.http.put(`${this.url}/eliminadoLogico/${id}`, null);
  }

  obtenerListServicioOrdenA(): Observable<Servicios[]> {
    const url = `${this.url}/listarServicioEstadoActivo`;
    return this.http.get<Servicios[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
    obtenerListServicioOrdenI(): Observable<Servicios[]> {
    const url = `${this.url}/listarServicioEstadoInactivo`;
    return this.http.get<Servicios[]>(url)
      .pipe(
        catchError(this.handleError)
        );
}
}