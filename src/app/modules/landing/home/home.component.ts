import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls    : ['./home.component.scss'],
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule , FuseCardComponent],
})
export class LandingHomeComponent {
    /**
     * Constructor
     */
    constructor(private _router: Router) {
    }


    redirectToTienda(): void {
        this._router.navigate(['/home-tienda']);
    }

    redirectToNosotros(): void {
        this._router.navigate(['nosotros']);
    }
}
