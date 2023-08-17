import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { Usuario } from 'app/services/models/usuario';
import { catchError, map, Observable, ReplaySubject, tap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
    url: string = 'http://localhost:8080/api/usuarios';
    private _user: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: User) {
        //Store the value
        this._user.next(value);
    }

    get user$(): Observable<User> {
        return this._user.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get the current logged in user data
     */
    get(): Observable<User> {
        return this._httpClient.get<User>(`${this.url}/listar`).pipe(
            tap((user) => {
                this._user.next(user);
            }),
        );
    }

    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any> {
        return this._httpClient.patch<User>('api/common/user', { user }).pipe(
            map((response) => {
                this._user.next(response);
            }),
        );
    }

    // Método para registrar un nuevo usuario
    registrarUsuario(usuario: User, rolId: number): Observable<User> {
        const url = `${this.url}/registrar/${rolId}`;
        return this._httpClient.post<User>(url, usuario);
    }

    obtenerListaResponsable(): Observable<Usuario[]> {
        const url = `${this.url}/listarResponsables`;
        return this._httpClient.get<Usuario[]>(url)
          .pipe(
            catchError(this.handleError)
          );
      }
    
      private handleError(error: any) {
        console.error('Ocurrió un error:', error);
        return throwError('Error en el servicio. Por favor, inténtalo de nuevo más tarde.');
      }


      
    registrarUsuarioConFoto(usuario: User, rolId: number, file: File | null): Observable<User> {
        const formData = new FormData();
        formData.append('usuario', JSON.stringify(usuario));
        
        if (file) {
            formData.append('file', file);
        }
    
        const url = `${this.url}/registrarConFoto/${rolId}`;
    
        return this._httpClient.post<User>(url, formData);
    }
    


    uploadFile(formData: FormData): Observable<any> {
        return this._httpClient.post(`${this.url}/upload`, formData);
    }



    actualizarUsuario(usuarioId: number, usuario: any, file: File | null): Observable<any> {
        const formData = new FormData();
        formData.append('usuario', JSON.stringify(usuario));
        if (file) {
          formData.append('file', file);
        }
    
        return this._httpClient.put(`${this.url}/actualizarUsuarioConFoto/${usuarioId}`, formData);
      }
    
      eliminadoLogico(id: any) {
        return this._httpClient.put(`${this.url}/eliminar/${id}`, null);
      }
}
