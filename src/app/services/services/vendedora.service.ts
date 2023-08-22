import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vendedora } from '../models/vendedora';

@Injectable({
  providedIn: 'root'
})
export class VendedorService {

  private baseUrl = 'http://localhost:8080/api/vendedor'; // Cambia la URL a la de tu servidor

  constructor(private http: HttpClient) { }

  registrarVendedor(vendedor: Vendedora, idSubscripcion: number): Observable<Vendedora> {
    const url = `${this.baseUrl}/registrar/${idSubscripcion}`;
    return this.http.post<Vendedora>(url, vendedor);
  }
  

}
