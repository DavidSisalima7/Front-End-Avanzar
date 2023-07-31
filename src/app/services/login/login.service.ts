import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, catchError, of } from 'rxjs';
import baserUrl from './helper';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public loginStatusSubjec = new Subject<boolean>();

  constructor(private http:HttpClient) { }

  //generamos el token
  public generarToken(loginData:any){
    return this.http.post(`${baserUrl}/api/login/generartoken`,loginData);
  }

  public getUsuarioActual(): Observable<any> {
    // Obtiene el token del local storage
    const token = this.getToken();

    // Verifica que haya un token válido antes de hacer la solicitud
    if (token) {
      // Agrega el token al encabezado Authorization
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Realiza la solicitud con el encabezado Authorization
      return this.http.get<any>(`${baserUrl}/api/login/usuarioActual`, { headers: headers })
        .pipe(
          catchError((error) => {
            // Maneja cualquier error que pueda ocurrir en la solicitud
            console.log('Error al obtener el usuario actual:', error);
            return of(null); // Devuelve un observable que emite un valor nulo en caso de error
          })
        );
    } else {
      // Si no hay un token válido, puedes devolver un observable que emite un valor nulo
      return of(null);
    }
  }

  //iniciamos sesión y establecemos el token en el localStorage
  public loginUser(token:any){
    localStorage.setItem('token',token);
    return true;
  }

  public isLoggedIn(){
    let tokenStr = localStorage.getItem('token');
    if(tokenStr == undefined || tokenStr == '' || tokenStr == null){
      return false;
    }else{
      return true;
    }
  }

  //cerrar sesion y eliminamos el token del localStorage
  public logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return true;
  }

  //obtenemos el token
  public getToken(){
    return localStorage.getItem('token');
  }

  public setUser(user:any){
    localStorage.setItem('user', JSON.stringify(user));
  }

  public getUser(){
    let userStr = localStorage.getItem('user');
    if(userStr != null){
      return JSON.parse(userStr);
    }else{
      this.logout();
      return null;
    }
  }

  public getUserRole(){
    let user = this.getUser();
    return user.authorities[0].authority;
  }

}
