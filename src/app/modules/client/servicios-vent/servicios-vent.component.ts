import { Component, OnInit, ViewEncapsulation ,ViewChild} from '@angular/core';
import { Servicios } from 'app/services/models/servicios';
import { ServiciosService } from 'app/services/services/servicios.service';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';


@Component({
  selector: 'servicios-vent',
 
  templateUrl: './servicios-vent.component.html',
  encapsulation: ViewEncapsulation.None,
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
 
})
export class ServiciosVentClientComponent implements OnInit {
  service: ServicioData[];
  displayedColumns: string[] = ['idServicio', 'nombreServicio', 'descripcionServicio', 'precioServicio', 'estado'];
  dataSource: MatTableDataSource<ServicioData>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit(): void {
    this.listarServicios();
  }
  
  listarServicios() {
    this.serviciosService.listarServicio().subscribe((datos: Servicios[]) => {
      this.service = datos.map(servicio => ({
        idServicio: servicio.idServicio.toString(),
        nombreServicio: servicio.nombreServicio,
        descripcionServicio: servicio.descripcionServicio,
        precioServicio: servicio.precioServicio.toString(),
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
  idServicio: string;
  nombreServicio: string;
  descripcionServicio: string;
  precioServicio: string;
  estado: string;
}

