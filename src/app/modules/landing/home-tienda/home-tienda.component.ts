import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { FuseCardComponent } from '@fuse/components/card';
import { Router, RouterLink } from '@angular/router';
@Component({
    selector     : 'home-tienda',
    templateUrl  : './home-tienda.component.html',
    styleUrls: ['./home-tienda.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatButtonModule, RouterLink, MatIconModule, MatInputModule,FuseCardComponent ],
    

})
export class HomeTiendaInvitadoComponent
{


    filters: {
        categorySlug$: BehaviorSubject<string>;
        query$: BehaviorSubject<string>;
        hideCompleted$: BehaviorSubject<boolean>;
    } = {
        categorySlug$ : new BehaviorSubject('all'),
        query$        : new BehaviorSubject(''),
        hideCompleted$: new BehaviorSubject(false),
    };

    /**
     * Constructor
     */
    constructor(private _router: Router)
    {
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


   
   filterByQuery(query: string): void
   {
       this.filters.query$.next(query);
   }


   

}
