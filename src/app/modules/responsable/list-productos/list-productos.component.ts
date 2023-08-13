import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Productos_R } from 'app/services/models/productosR';
import { ProductosService } from 'app/services/services/productos.service';

@Component({
    selector     : 'list-emprendedoras',
    standalone   : true,
    templateUrl  : './list-productos.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
})
export class ListProductosResponsableComponent
{
    service: Productos_R[];
    displayedColumns: string[] = ['idProducto', 'nombreProducto', 'precioProducto','cantidaDisponible', 'estado'];
    dataSource: MatTableDataSource<ProductoData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
    /**
     * Constructor
     */
    constructor(private productoService: ProductosService)
    {
    }
    ngOnInit(): void {
        this.listarProductos();
    }
    listarProductos() {
        this.productoService.getProductos().subscribe((datos: Productos_R[]) => {
          this.service = datos.map(producto => ({
            idProducto: producto.idProducto,
            nombreProducto: producto.nombreProducto.toString(),
            precioProducto: producto.precioProducto,
            cantidadDisponible: producto.cantidadDisponible,
            estado: producto.estado ? true : false
            
          }));
      
          this.dataSource = new MatTableDataSource<Productos_R>(this.service);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      }
     
    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    
        if (this.dataSource.paginator) {
          this.dataSource.paginator.firstPage();
        }
      }
}
export class ProductoData {
    idProducto: number;
    nombreProducto: string='';
    precioProducto: number;
    cantidadDisponible: number;
    estado: boolean;
}