import { CategoriaProducto } from "app/modules/emprendedora/ecommerce/inventory/inventory.types";

export class Productos {
    idProducto: number;
    nombreProducto: string='';
    precioProducto: number;
    cantidadDisponible:number;
    estado: boolean;
}


export class ProductosModels {
    idProducto: number;
    nombreProducto: string;
    precioProducto: number;
    cantidadDisponible: number;
    estadoProducto: boolean;
    descripcionProducto: string;
    miniaturaProducto: string;
    pesoProducto: number;
    categoriaProducto: CategoriaProducto;
}

