import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FuseCardComponent } from '@fuse/components/card';
import { Router, RouterLink } from '@angular/router';


@Component({
    selector     : 'nosotros',
    templateUrl  : './nosotros.component.html',
    styleUrls: ['./nosotros.component.scss'],

    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, RouterLink, MatIconModule, FuseCardComponent],
})
export class NosotrosInvitadoComponent
{
    /**
     * Constructor
     */
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
