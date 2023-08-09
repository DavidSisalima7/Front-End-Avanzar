import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'list-productos',
    standalone   : true,
    templateUrl  : './list-productos.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ListProductosEmprendedoraComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
