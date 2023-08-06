import { Persona } from "app/services/models/persona";

export class User
{
    id: number;
    name:string;
    username: string;
    password:string;
    avatar?: string;
    enabled:boolean;
    visible:boolean;
    persona?:Persona;
}
