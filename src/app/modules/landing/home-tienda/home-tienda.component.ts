import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector     : 'home-tienda',
    templateUrl  : './home-tienda.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, RouterLink, MatIconModule],
})
export class HomeTiendaInvitadoComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
