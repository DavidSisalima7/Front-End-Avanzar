import { Vendedor } from "app/services/models/vendedora";

export interface InventarioProductos {
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

export interface InventarioServicios {
    idServicio: number;
    nombreServicio: string;
}

export interface CategoriaProducto {
    idCategoriaProducto: number;
    nombreCategoriaProducto: string;
    descripcion: string;
    estado: boolean;
}

export interface InventarioPublicaciones {

    idPublicacion: number;
    tituloPublicacion: string;
    descripcionPublicacion: string;
    estado: boolean;
    fechaPublicacion: Date;
    vendedor: Vendedor;
    categoria: CategoriaPublicacion;
    productos: InventarioProductos;
    servicios: InventarioServicios;
    imagenes: string[];
}



export interface CategoriaPublicacion {

    idCategoria: number;
    nombreCategoria: string;
    descripcion: string;
    estado: boolean;
}

export interface InventoryPagination
{
    length: number;
    size: number;
    page: number;
    lastPage: number;
    startIndex: number;
    endIndex: number;
}
