import { Persona } from "./persona";

export class Usuario {
    id: number;
    username: string='';
    name: string='';
    password: string='';
    estado: boolean;
    visible: boolean;
    persona?:Persona;
}