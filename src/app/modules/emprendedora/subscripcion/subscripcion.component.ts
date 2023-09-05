import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
    selector     : 'subscripcion',
    standalone   : true,
    templateUrl  : './subscripcion.component.html',
    encapsulation: ViewEncapsulation.None,
    imports        : [FuseCardComponent, MatIconModule, MatButtonModule],
})
export class SubscripcionEmprendedoraComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
