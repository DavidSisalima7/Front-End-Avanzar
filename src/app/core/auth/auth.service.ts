import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import baserUrl from './helper';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _authenticated: boolean = false;

  /**
   * Constructor
   */
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
  ) {
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Forgot password
   *
   * @param email
   */
  forgotPassword(email: string): Observable<any> {
    return this._httpClient.post('api/auth/forgot-password', email);
  }

  /**
   * Reset password
   *
   * @param password
   */
  resetPassword(password: string): Observable<any> {
    return this._httpClient.post('api/auth/reset-password', password);
  }

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { username: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError('User is already logged in.');
    }

    return this._httpClient.post('http://localhost:8080/api/login/generartoken', credentials).pipe(
      switchMap((response: any) => {

        // Store the access token in the local storage
        this.accessToken = response.token;

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this._userService.user = response.usuario;

        // Return a new observable with the response
        return of(response);
      }),
    );


  }


  /**
   * Sign in using the access token
   */
  signInUsingToken(): Observable<any> {
    // Sign in using the token
    return this._httpClient.post('http://localhost:8080/api/login/signInWithToken', {
      accessToken: this.accessToken,
    }).pipe(
      catchError(() =>

        // Return false
        of(false),
      ),
      switchMap((response: any) => {
        // Replace the access token with the new one if it's available on
        // the response object.
        //
        // This is an added optional step for better security. Once you sign
        // in using the token, you should generate a new one on the server
        // side and attach it to the response object. Then the following
        // piece of code can replace the token with the refreshed one.

        if (response.accessToken) {
          this.accessToken = response.token;
        }

        // Set the authenticated flag to true
        this._authenticated = true;

        // Store the user on the user service
        this._userService.user = response.usuario;

        // Return true
        return of(true);
      }),
    );
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token from the local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('userResponsable');
    localStorage.removeItem('Rol')
    // Set the authenticated flag to false
    this._authenticated = false;

    // Return the observable
    return of(true);
  }

  /**
   * Sign up
   *
   * @param user
   */
  signUp(user: { name: string; email: string; password: string; company: string }): Observable<any> {
    return this._httpClient.post('api/auth/sign-up', user);
  }

  /**
   * Unlock session
   *
   * @param credentials
   */
  unlockSession(credentials: { email: string; password: string }): Observable<any> {
    return this._httpClient.post('api/auth/unlock-session', credentials);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check the access token availability
    if (!this.accessToken) {
      return of(false);
    }

    // Check the access token expire date
    if (AuthUtils.isTokenExpired(this.accessToken)) {
      return of(false);
    }

    // If the access token exists, and it didn't expire, sign in using it
    return this.signInUsingToken();
  }

  public getUsuarioActual(): Observable<any> {
    // Obtiene el token del local storage
    const token = this.accessToken;

    // Verifica que haya un token válido antes de hacer la solicitud
    if (token) {
      // Agrega el token al encabezado Authorization
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Realiza la solicitud con el encabezado Authorization
      return this._httpClient.get<any>(`${baserUrl}/api/login/usuarioActual`, { headers: headers })
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
  public loginUser(token: any) {
    localStorage.setItem('token', token);
    return true;
  }

  //obtenemos el token
  public getToken() {
    return localStorage.getItem('token');
  }

  public setUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }

 

  public getUser() {
    let userStr = localStorage.getItem('user');
    if (userStr != null) {
      return JSON.parse(userStr);
    } else {
      this.signOut();
      return null;
    }
  }

  public getUserRole() {
    let user = this.getUser();
    return user.authorities[0].authority;
  }
}
