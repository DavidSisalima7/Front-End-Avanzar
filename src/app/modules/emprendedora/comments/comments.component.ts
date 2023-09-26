import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'comments',
    standalone   : true,
    templateUrl  : './comments.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class CommentsComponent
{
    /**
     * Constructor
     */
    constructor()
    {
    }
}
