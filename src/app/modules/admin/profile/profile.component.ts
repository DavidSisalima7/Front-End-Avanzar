import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'profile',
    standalone   : true,
    templateUrl  : './profile.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ProfileAdminComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
