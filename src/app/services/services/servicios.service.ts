import { Injectable } from "@angular/core";
import { Servicios } from "../models/servicios";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ServiciosService {
  private url: string = 'http://localhost:8080/api/servicios';

  constructor(private http: HttpClient) { }

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
}