import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { Router, RouterLink } from '@angular/router';
@Component({
    selector     : 'planes',
    standalone   : true,
    templateUrl  : './planes.component.html',
    encapsulation: ViewEncapsulation.None,


    imports      : [MatButtonModule, RouterLink, MatIconModule, FuseCardComponent],
})
export class PlanesComponent
{

    constructor(private _router: Router) {
    }


    redirectToTienda(): void {
        this._router.navigate(['/contactanos']);
    }

    redirectToNosotros(): void {
        this._router.navigate(['/nosotros']);
    }

    redirectToPlanes(): void {
        this._router.navigate(['/planes']);
    }

    redirectToHome(): void {
        this._router.navigate(['/home']);
    }
}
