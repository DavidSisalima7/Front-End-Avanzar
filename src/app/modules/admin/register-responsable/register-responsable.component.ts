import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
    selector     : 'register-responsable',
    templateUrl  : './register-responsable.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [MatIconModule, FormsModule, ReactiveFormsModule, MatStepperModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, 
        MatButtonModule, MatCheckboxModule, MatRadioModule,MatTableModule,MatTabsModule,MatDatepickerModule],
})
export class RegisterResponsableComponent implements OnInit
{
    horizontalStepperForm: UntypedFormGroup;
    verticalStepperForm: UntypedFormGroup;

    /**
     * Constructor
     */
    constructor(private _formBuilder: UntypedFormBuilder)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Horizontal stepper form
        this.horizontalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                Primer : ['', Validators.required],
                Segundo : ['', Validators.required],
                PrimerA : ['', Validators.required],
                SegundoA : ['', Validators.required],
                email   : ['', [Validators.required, Validators.email]],
                country : ['', Validators.required],
                cedula : ['', Validators.required],
                celular: ['', Validators.required],
                fecha: ['', Validators.required],
                nacionalidad: ['', Validators.required],
                descrip: ['', Validators.required],
                Direccion: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName : ['', Validators.required],
                userName : ['', Validators.required],
                contra : ['', Validators.required],
                about    : [''],
            }),
            step3: this._formBuilder.group({
                byEmail          : this._formBuilder.group({
                    companyNews     : [true],
                    featuredProducts: [false],
                    messages        : [true],
                }),

            }),
        });

        // Vertical stepper form
        this.verticalStepperForm = this._formBuilder.group({
            step1: this._formBuilder.group({
                Primer : ['', Validators.required],
                Segundo : ['', Validators.required],
                PrimerA : ['', Validators.required],
                SegundoA : ['', Validators.required],
                email   : ['', [Validators.required, Validators.email]],
                country : ['', Validators.required],
                cedula : ['', Validators.required],
                celular: ['', Validators.required],
                fecha: ['', Validators.required],
                nacionalidad: ['', Validators.required],
                descrip: ['', Validators.required],
                Direccion: ['', Validators.required],
            }),
            step2: this._formBuilder.group({
                firstName: ['', Validators.required],
                lastName : ['', Validators.required],
                userName : ['', Validators.required],
                contra : ['', Validators.required],
                about    : [''],
            }),
            step3: this._formBuilder.group({
                byEmail          : this._formBuilder.group({
                    companyNews     : [true],
                    featuredProducts: [false],
                    messages        : [true],
                }),

            }),
        });
    }
}
