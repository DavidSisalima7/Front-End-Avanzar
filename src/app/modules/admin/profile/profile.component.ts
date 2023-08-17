import { TextFieldModule } from '@angular/cdk/text-field';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
    selector: 'profile',
    standalone: true,
    templateUrl: './profile.component.html',
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink, FuseCardComponent, MatIconModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, TextFieldModule, MatDividerModule, MatTooltipModule, NgClass],
})
export class ProfileAdminComponent {
    /**
     * Constructor
     */

    userExtraido: any;
    ngOnInit(): void {

        const userString = localStorage.getItem('user');
        this.userExtraido = JSON.parse(userString);
        

    }

    constructor() {
    }


    formatDate(dateString: string): string {
        const [day, month, year] = dateString.split('/');
        const monthsInSpanish = [
            'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
            'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
        ];
        
        const monthName = monthsInSpanish[parseInt(month) - 1];
        
        return `${day} de ${monthName} de ${year}`;
    }
}
