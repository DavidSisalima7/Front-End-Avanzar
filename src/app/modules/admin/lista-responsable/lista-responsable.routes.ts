import { inject } from '@angular/core';
import { Routes } from '@angular/router';
import { ResponsableComponent  } from 'app/modules/admin/lista-responsable/responsable/responsable.component';
import { ResponsableService } from 'app/modules/admin/lista-responsable/responsable/responsable.service';
import { InventoryListComponent } from 'app/modules/admin/lista-responsable/responsable/lista/responsable.component';

export default [
    {
        path      : '',
        pathMatch : 'full',
        redirectTo: 'responsable',
    },
    {
        path     : 'responsable',
        component: ResponsableComponent,
        children : [
            {
                path     : '',
                component: InventoryListComponent,
                resolve  : {
                    brands    : () => inject(ResponsableService).getBrands(),
                    categories: () => inject(ResponsableService).getCategories(),
                    products  : () => inject(ResponsableService).getProducts(),
                    tags      : () => inject(ResponsableService).getTags(),
                    vendors   : () => inject(ResponsableService).getVendors(),
                },
            },
        ],
    },
] as Routes;
