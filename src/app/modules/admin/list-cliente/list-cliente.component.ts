import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'list-cliente',
    standalone   : true,
    templateUrl  : './list-cliente.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ListAdminClienteComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
