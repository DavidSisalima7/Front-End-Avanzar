import { NgClass, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';


@Component({
    selector     : 'planes',
    standalone   : true,
    templateUrl  : './planes.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports        : [MatButtonModule, NgClass, FuseCardComponent, NgIf, MatIconModule],

})
export class PlanesResponsableComponent
{

    yearlyBilling: boolean = true;
    /**
     * Constructor
     */
    constructor()
    {
    }
}
