import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from 'app/core/user/user.service';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone     : true,
    imports        : [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSlideToggleModule, MatButtonModule],
})
export class SettingsSecurityComponent implements OnInit
{
    securityForm: FormGroup;
    errorMessage: string = '';
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

      this.securityForm = this._formBuilder.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required]
      });
            
    }

    cambiarContrasena(currentPassword: string, newPassword: string): void {
      this.userService.actualizarContrasena(currentPassword, newPassword).subscribe(
        () => {
          console.log('Contraseña cambiada con éxito');
          // Realiza acciones adicionales después de cambiar la contraseña si es necesario.
        },
        (error) => {
          console.error('Error al cambiar la contraseña', error);
          if (error.status === 401) {
            this.errorMessage = 'La contraseña actual no coincide.';
          } else {
            this.errorMessage = 'Ocurrió un error al cambiar la contraseña.';
          }
          // Manejo de otros errores si es necesario.
        }
      );
    }
  


}
