import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { BehaviorSubject, combineLatest, Subject, takeUntil } from 'rxjs';
import { FuseCardComponent } from '@fuse/components/card';
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
    constructor()
    {
    }


   
   filterByQuery(query: string): void
   {
       this.filters.query$.next(query);
   }

}
