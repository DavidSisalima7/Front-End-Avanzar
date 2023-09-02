export class Servicios {
    idServicio: number;
    nombreServicio: string='';
    descripcionServicio: string='';
    precioServicio:number;
    estado: boolean;
    
}

export class ServicioModels {
    idServicio: number;
    nombreServicio: string;
    descripcionServicio:string;
    precioServicio:string;
    estado:boolean;
    tiempoServicio:number;
    cantidadDisponible: number;
    miniaturaServicio:string;
    categoriaServicio:CategoriaServicio;
}


export class CategoriaServicio {
    idCategoriaServicio: number;
    nombreCategoria: string;
    descripcion: string;
    estado: boolean;
}