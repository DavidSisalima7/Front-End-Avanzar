import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'favoritos',
    standalone   : true,
    templateUrl  : './favoritos.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class FavoritosClientComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
