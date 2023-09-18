import { AsyncPipe, CurrencyPipe, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule} from '@angular/forms';



import { HttpClient } from '@angular/common/http';
import { Usuario } from 'app/services/models/usuario';

@Component({
  selector: 'app-comentarios-modal',
  templateUrl: './comentarios-modal.component.html',
  styleUrls: ['./comentarios-modal.component.scss'],
  standalone: true,
  imports: [NgFor, MatIconModule, FormsModule, MatFormFieldModule, NgIf],
})
export class ComentariosModalComponent {
  comentarios: Comentario[] = []; // Lista de comentarios

  constructor(
    public dialogRef: MatDialogRef<ComentariosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.comentarios = data.comentarios || []; // Inicializa la lista de comentarios con los datos proporcionados o un array vacío
  }

  cerrarModal() {
    this.dialogRef.close(); // Cierra el modal de comentarios
  }
}

interface Comentario {
  texto: string;
  fecha: Date;
}

/*
export class ComentariosModalComponent {
  comentarios: string[] = []; // Lista de comentarios
  nuevoComentario: string = ''; // Nuevo comentario a agregar
  usuarioId: number = 0; // ID del usuario actual, puedes inicializarlo con el valor correcto

  constructor(
    public dialogRef: MatDialogRef<ComentariosModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient // Inyecta el servicio HttpClient para realizar solicitudes HTTP
  ) {
    this.comentarios = data.comentarios; // Inicializa la lista de comentarios con los datos proporcionados
  }

  agregarComentario() {
    if (this.usuarioId === 2) {
      console.error('No tienes permiso para agregar comentarios.');
      return; // Sale de la función si el usuario tiene ID igual a 2
    }

    if (this.nuevoComentario || this.usuarioId === 3) {
      // Realiza una solicitud HTTP POST para agregar el nuevo comentario en el backend
      this.http.post('/api/comentarios/registrar', { comentario: this.nuevoComentario })
        .subscribe(
          (resultado: any) => {
            // Verifica si el resultado contiene la propiedad "comentario"
            if (resultado && resultado.comentario) {
              // Actualiza la lista de comentarios con el nuevo comentario devuelto por el backend
              this.comentarios.push(resultado.comentario);
              this.nuevoComentario = ''; // Limpia el campo del nuevo comentario
            } else {
              console.error('La respuesta del servidor no contiene un comentario válido.');
            }
          },
          (error) => {
            console.error('Error al realizar la solicitud HTTP POST:', error);
          }
        );
    } else {
      console.error('No tienes permiso para agregar comentarios.');
    }
  }

  cerrarModal() {
    this.dialogRef.close(); // Cierra el modal de comentarios
  }
}*/