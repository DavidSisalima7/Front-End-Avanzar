import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'profile-client',
    standalone   : true,
    templateUrl  : './profile.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class ProfileClientComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
