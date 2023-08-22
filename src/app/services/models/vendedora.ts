import { DetalleSubscripcion } from "./detalleSubscripcion";
import { Usuario } from "./usuario";


export class Vendedora {
    idVendedora: number;
    nombreEmprendimiento: string='';
    usuario ?: Usuario;
    detalleSubscripcion ?: DetalleSubscripcion;
}