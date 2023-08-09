import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector     : 'nosotros',
    templateUrl  : './nosotros.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, RouterLink, MatIconModule],
})
export class NosotrosInvitadoComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
