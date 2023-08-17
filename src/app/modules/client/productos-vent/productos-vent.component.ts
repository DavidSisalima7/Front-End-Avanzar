import { Component, OnInit, ViewEncapsulation ,ViewChild} from '@angular/core';


import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { Productos } from 'app/services/models/productos';
import { ProductosService } from 'app/services/services/producto.service';


@Component({
  selector: 'productos-vent',
 
  templateUrl: './productos-vent.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
 
})
export class ProductosVentClientComponent implements OnInit {
    service: ServicioData[];
    displayedColumns: string[] = ['idProducto', 'nombreProducto', 'precioProducto', 'cantidadDisponible', 'estado'];
    dataSource: MatTableDataSource<ServicioData>;
  
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
  
    constructor(private productosService: ProductosService) {}
  
    ngOnInit(): void {
      this.listarProductos();
    }
    
    listarProductos() {
      this.productosService.listarProducto().subscribe((datos: Productos[]) => {
        this.service = datos.map(servicio => ({
            idProducto: servicio.idProducto.toString(),
            nombreProducto: servicio.nombreProducto,
            precioProducto: servicio.precioProducto.toString(),
            cantidadDisponible: servicio.cantidadDisponible.toString(),
          estado: servicio.estado ? 'Activo' : 'Inactivo'
          
        }));
    
        this.dataSource = new MatTableDataSource<ServicioData>(this.service);
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
  
  /** Builds and returns a new Servicio. */
  
  interface ServicioData {
    idProducto: string;
    nombreProducto: string;
    precioProducto: string;
    cantidadDisponible: string;
    estado: string;
  }