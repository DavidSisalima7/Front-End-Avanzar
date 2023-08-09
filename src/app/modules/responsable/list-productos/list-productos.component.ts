import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'list-emprendedoras',
    standalone   : true,
    templateUrl  : './list-productos.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ListProductosResponsableComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
