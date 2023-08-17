import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatDateFormats, MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { UserService } from 'app/core/user/user.service';


export const MY_FORMATS: MatDateFormats = {
    parse: {
      dateInput: 'DD/MM/YYYY',
    },
    display: {
      dateInput: 'DD/MM/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'DD/MM/YYYY',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  };

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations,
    standalone     : true,
    imports        : [FormsModule, ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, TextFieldModule, MatSelectModule, MatOptionModule, MatButtonModule,CommonModule,MatDatepickerModule],
})
export class SettingsAccountComponent implements OnInit
{

    accountForm: UntypedFormGroup;
    selectedFile: File | null = null; // Variable para almacenar el archivo seleccionado

    @ViewChild('accountForm') signInNgForm: NgForm;

     usuario = JSON.parse(localStorage.getItem('user'));
     rol = localStorage.getItem('Rol');


     alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    showAlert: boolean = false;

    selectedDate: Date | null = null;

  onDateChange(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
  }

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService
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

        
        // Create the form
        this.accountForm = this._formBuilder.group({
            Firstname    : [this.usuario.persona.primer_nombre],
            Secondname    : [this.usuario.persona.segundo_nombre],
            FirstSurname    : [this.usuario.persona.primer_apellido],
            SecondSurname    : [this.usuario.persona.segundo_apellido],
            rol: [this.rol],
            username: [this.usuario.name],
            email   : [this.usuario.persona.correo],
            phone   : [this.usuario.persona.celular],
            country : [this.usuario.persona.direccion],
            direccion: [this.usuario.persona.direccion],
            avatar:[this.usuario.avatar],
            descripcion:[this.usuario.persona.descripcion],
            nacionalidad:[this.usuario.persona.nacionalidad],
            genero:[this.usuario.persona.genero]
        });
    }

    onFileSelected(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        if (inputElement.files && inputElement.files.length > 0) {
            this.selectedFile = inputElement.files[0];
            
            const reader = new FileReader();
            reader.onload = (e) => {
                this.accountForm.patchValue({
                    avatar: reader.result, // Actualiza la URL de la imagen previa en el formulario
                });
            };
            reader.readAsDataURL(this.selectedFile);
           // Set the alert
           this.alert = {
            type: 'error',
            message: 'Correo electrónico o contraseña incorrectos',
        };

        // Show the alert
        this.showAlert = true;
        }
    }


    onSubmit() {

        this.showAlert = false;

        const usuarioId = this.usuario.id; 
        const usuarioActualizado = {
            persona: {
              primer_nombre: this.accountForm.value.Firstname,
              segundo_nombre: this.accountForm.value.Secondname,
              primer_apellido: this.accountForm.value.FirstSurname,
              segundo_apellido: this.accountForm.value.SecondSurname,
              correo: this.accountForm.value.email,
              celular: this.accountForm.value.phone,
              direccion: this.accountForm.value.direccion,
            },
            username:this.accountForm.value.email,
            name: this.accountForm.value.username,
            avatar: this.accountForm.value.avatar,
          };
      
        this._userService.actualizarUsuario(usuarioId, usuarioActualizado, this.selectedFile).subscribe(
          (response) => {
            this.alert = {
                type: 'success',
                message: 'Usuario actualizado correctamente.',
            };
            // Show the alert
            this.showAlert = true;
            console.error(response);
          },
          (error) => {
            this.alert = {
                type: 'error',
                message: 'Error al actualizar el usuario.',
            };

            // Show the alert
            this.showAlert = true;
            console.error(error);
            
          }
        );
      }
      



}
