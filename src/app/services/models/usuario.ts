import { Persona } from "./persona";

export class Usuario {
    id: number;
    username: string='';
    password: string='';
    estado: boolean;
    persona?:Persona;
}