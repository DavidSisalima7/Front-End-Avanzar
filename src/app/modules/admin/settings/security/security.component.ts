import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import { MatIconModule } from '@angular/material/icon';

import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserService } from 'app/core/user/user.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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

  showAlert: boolean = false;
  alertType: string = ''; // Puede ser 'error', 'success', u otro tipo
  alertMessage: string = '';

  /**
   * Constructor
   */
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private userService: UserService
  ) {}

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit(): void {
    this.securityForm = this._formBuilder.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required]
    });
  }

  cambiarContrasena(currentPassword: string, newPassword: string): void {
    if (this.securityForm.valid) {
      this.userService.actualizarContrasena(currentPassword, newPassword).subscribe(
        () => {
          this.showAlert = true;
          this.alertType = 'success';
          this.alertMessage = 'Contraseña cambiada con éxito';

          // Realiza acciones adicionales después de cambiar la contraseña si es necesario.
        },
        (error) => {
          console.error('Error al cambiar la contraseña', error);
          if (error.status === 401) {
            this.alertType = 'error';
            this.alertMessage = 'La contraseña actual no coincide.';
          } else {
            this.alertType = 'error';
            this.alertMessage = 'Ocurrió un error al cambiar la contraseña.';
          }
          // Manejo de otros errores si es necesario.
        }
      );
    } else {
      // Marca los campos como tocados para mostrar los mensajes de error
      this.securityForm.controls.currentPassword.markAsTouched();
      this.securityForm.controls.newPassword.markAsTouched();
    }
  }
}