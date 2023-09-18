import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-comentarios-modal',
  templateUrl: './comentarios-modal.component.html',
  styleUrls: ['./comentarios-modal.component.scss']
})
export class ComentariosModalComponent {
  @Output() confirmacionCerrada: EventEmitter<boolean> = new EventEmitter<boolean>();
}
