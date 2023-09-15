export class Servicios {
    idServicio?: number;
    nombreServicio: string;
    precioServicio:number;
    descripcionServicio?: string;
    tiempoServicio:string;
    cantidadDisponible: number;
    estado?: boolean;
    categoriaServicio:CategoriaServicio;
}

export class ServicioModels {
    idServicio: number;
    nombreServicio: string;
    descripcionServicio:string;
    precioServicio:string;
    estado:boolean;
    tiempoServicio:string;
    cantidadDisponible: number;
    miniaturaServicio:string;
    categoriaServicio:CategoriaServicio;
}


export class CategoriaServicio {
    idCategoriaServicio: number;
    nombreCategoria: string;

}