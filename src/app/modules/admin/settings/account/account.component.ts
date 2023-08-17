import { TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule  } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { User } from 'app/core/user/user.types';
import { Subject, takeUntil } from 'rxjs';


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
    //Usuario logeado
    user: User;

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
  
    paises = [
    { value: 'Ecuador', label: 'Ecuador' },
    { value: 'colombia', label: 'Colombia' }
    ];


    private _unsubscribeAll: Subject<any> = new Subject<any>();
    /**
     * Constructor
     */
    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _userService: UserService,
        private renderer:Renderer2
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
        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) =>
            {
                this.user = user;
            });

        const dateOfBirth = new Date(this.user.persona.fecha_nacimiento); // Convertir a objeto Date
        this.selectedDate = dateOfBirth;
        
        
        // Create the form
        this.accountForm = this._formBuilder.group({
            Firstname    : [this.user.persona.primer_nombre],
            Secondname    : [this.user.persona.segundo_nombre],
            FirstSurname    : [this.user.persona.primer_apellido],
            SecondSurname    : [this.user.persona.segundo_apellido],
            rol: [this.rol],
            username: [this.user.name],
            email   : [this.user.persona.correo],
            phone   : [this.user.persona.celular],
            address: [this.user.persona.direccion],
            avatar:[this.user.avatar],
            description:[this.user.persona.descripcion],
            nationality:[this.user.persona.nacionalidad],
            genero:[this.user.persona.genero],
            dateBirth: [dateOfBirth] 
            
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
              direccion: this.accountForm.value.address,
              nacionalidad:this.accountForm.value.nationality,
              genero:this.accountForm.value.genero,
              fecha_nacimiento:this.accountForm.value.dateBirth,
              descripcion:this.accountForm.value.description
            },
            username:this.accountForm.value.email,
            name: this.accountForm.value.username,
            avatar: this.accountForm.value.avatar,
          };
      
        this._userService.actualizarUsuario(usuarioId, usuarioActualizado, this.selectedFile).subscribe(
          (response) => {
            this.renderer.setProperty(window,'location',location);
            console.log("correcto",response);
            //falta alerta de correcto.
    
          },
          (error) => {
        
            console.error("error",error);
            
          }
        );
      }
      



}
