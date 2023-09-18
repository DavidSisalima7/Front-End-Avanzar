import { Usuario } from "./usuario";
import { Publicacion } from "./publicaciones";

export class Comentarios{
    idComentario: number;
    texto: string;
    fecha: Date;
    
    usuario?: Usuario;
    publicaciones?: Publicacion;

}
