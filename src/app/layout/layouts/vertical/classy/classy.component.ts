import { NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { FuseFullscreenComponent } from '@fuse/components/fullscreen';
import { FuseLoadingBarComponent } from '@fuse/components/loading-bar';
import { FuseNavigationItem, FuseNavigationService, FuseVerticalNavigationComponent } from '@fuse/components/navigation';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { Navigation } from 'app/core/navigation/navigation.types';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { LanguagesComponent } from 'app/layout/common/languages/languages.component';
import { MessagesComponent } from 'app/layout/common/messages/messages.component';
import { NotificationsComponent } from 'app/layout/common/notifications/notifications.component';
import { QuickChatComponent } from 'app/layout/common/quick-chat/quick-chat.component';
import { SearchComponent } from 'app/layout/common/search/search.component';
import { ShortcutsComponent } from 'app/layout/common/shortcuts/shortcuts.component';
import { UserComponent } from 'app/layout/common/user/user.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector     : 'classy-layout',
    templateUrl  : './classy.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone   : true,
    imports      : [FuseLoadingBarComponent, FuseVerticalNavigationComponent, NotificationsComponent, UserComponent, NgIf, MatIconModule, MatButtonModule, LanguagesComponent, FuseFullscreenComponent, SearchComponent, ShortcutsComponent, MessagesComponent, RouterOutlet, QuickChatComponent],
})
export class ClassyLayoutComponent implements OnInit, OnDestroy
{
    isScreenSmall: boolean;
    navigation: Navigation;
    user: User;
    rol: any;
    navigationName: any

    
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _navigationService: NavigationService,
        private _userService: UserService,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Subscribe to navigation data
        const rolIngresado = localStorage.getItem('Rol');

        this.swapNavigationData('mainNavigation'); // Llama al método con el rol

        this._navigationService.navigation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((navigation: Navigation) =>
            {
                this.navigation = navigation;
            });

        // Subscribe to the user service
        this._userService.user$
            .pipe((takeUntil(this._unsubscribeAll)))
            .subscribe((user: User) =>
            {
                this.user = user;
            });

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) =>
            {
                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });

    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }


    swapNavigationData(navigationName: string): void {
        // Obtiene el rol almacenado en el localStorage
        const rolIngresado = localStorage.getItem('Rol');

        // Define las opciones de navegación en función del rol
        let newNavigation: FuseNavigationItem[] = [];

        switch (rolIngresado) {
            case 'ADMIN':
                newNavigation = [
                    // ... opciones de navegación para el rol de administrador
                    {
                        id      : 'tablero',
                        title   : 'Tablero',
                        subtitle: 'Acciones rápidas',
                        type    : 'group',
                        icon    : 'memory',
                        children: [
                            {
                                id   : 'dashboard',
                                title: 'Dashboard',
                                type : 'basic',
                                icon : 'heroicons_outline:chart-pie',
                                link : '/dash-admin'
                            }
                        ],

                    },

                    // ... opciones de navegación para el rol de administrador
                    {
                        id      : 'listas',
                        title   : 'Listados',
                        subtitle: 'Detalles registros',
                        type    : 'group',
                        icon    : 'memory',
                        children: [
                            {
                                id   : 'list-resp',
                                title: 'Responsables Ventas',
                                type : 'basic',
                                icon : 'heroicons_outline:document-text',
                                link : '/list-responsables'
                            },

                            {
                                id   : 'list-empren',
                                title: 'Emprendedoras',
                                type : 'basic',
                                icon : 'heroicons_outline:document-text',
                                link : '/list-emprend'
                            },
                            {
                                id   : 'list-clie',
                                title: 'Clientes',
                                type : 'basic',
                                icon : 'heroicons_outline:document-text',
                                link : '/list-clie'
                            }
                        ]
                    },

                    {
                        id      : 'perfil',
                        title   : 'Perfil',
                        subtitle: 'Información personal',
                        type    : 'group',
                        icon    : 'memory',
                        children: [
                            {
                                id   : 'profile',
                                title: 'Perfil',
                                type : 'basic',
                                icon : 'heroicons_outline:user-circle',
                                link : '/profile-admin'
                            },

                            {
                                id   : 'settings',
                                title: 'Cofiguración',
                                type : 'basic',
                                icon : 'heroicons_outline:cog-6-tooth',
                                link : '/config-admin'
                            }
                        ]
                    }
                ];
                break;
    
            case 'RESPONSABLE_VENTAS':
                newNavigation = [
                    {
                        id      : 'tablero',
                        title   : 'Tablero',
                        subtitle: 'Acciones rápidas',
                        type    : 'group',
                        icon    : 'memory',
                        children: [
                            {
                                id   : 'dashboard',
                                title: 'Dashboard',
                                type : 'basic',
                                icon : 'heroicons_outline:chart-pie',
                                link : '/dash-resp'
                            }
                        ],

                    },

                    // ... opciones de navegación para el rol de administrador
                    {
                        id      : 'listas',
                        title   : 'Listados',
                        subtitle: 'Detalles registros',
                        type    : 'group',
                        icon    : 'memory',
                        children: [
                            {
                                id   : 'list-emprendedoras',
                                title: 'Emprendedoras',
                                type : 'basic',
                                icon : 'heroicons_outline:document-text',
                                link : '/list-empre-resp'
                            },

                            {
                                id   : 'list-productos',
                                title: 'Productos',
                                type : 'basic',
                                icon : 'heroicons_outline:document-text',
                                link : '/list-prod-resp'
                            },

                            {
                                id   : 'list-servicios',
                                title: 'Servicios',
                                type : 'basic',
                                icon : 'heroicons_outline:document-text',
                                link : '/list-serv-resp'
                            }
                        ]
                    },

                    {
                        id      : 'perfil',
                        title   : 'Perfil',
                        subtitle: 'Información personal',
                        type    : 'group',
                        icon    : 'memory',
                        children: [
                            {
                                id   : 'profile',
                                title: 'Perfil',
                                type : 'basic',
                                icon : 'heroicons_outline:user-circle',
                                link : '/profile-resp'
                            },

                            {
                                id   : 'settings',
                                title: 'Cofiguración',
                                type : 'basic',
                                icon : 'heroicons_outline:cog-6-tooth',
                                link : '/config-resp'
                            }
                        ]
                    }
                ];
                break;
    
                case 'EMPRENDEDORA':
                    newNavigation = [
                        {
                            id      : 'tablero',
                            title   : 'Tablero',
                            subtitle: 'Acciones rápidas',
                            type    : 'group',
                            icon    : 'memory',
                            children: [
                                {
                                    id   : 'dashboard',
                                    title: 'Dashboard',
                                    type : 'basic',
                                    icon : 'heroicons_outline:chart-pie',
                                    link : '/dash-empre'
                                }
                            ],
    
                        },
    
                        // ... opciones de navegación para el rol de administrador
                        {
                            id      : 'listas',
                            title   : 'Listados',
                            subtitle: 'Detalles registros',
                            type    : 'group',
                            icon    : 'memory',
                            children: [
                                {
                                    id   : 'list-prod',
                                    title: 'Productos',
                                    type : 'basic',
                                    icon : 'heroicons_outline:document-text',
                                    link : '/list-empre-prod'
                                },
    
                                {
                                    id   : 'list-serv',
                                    title: 'Servicios',
                                    type : 'basic',
                                    icon : 'heroicons_outline:document-text',
                                    link : '/list-empre-serv'
                                }
                            ]
                        },
    
                        {
                            id      : 'perfil',
                            title   : 'Perfil',
                            subtitle: 'Información personal',
                            type    : 'group',
                            icon    : 'memory',
                            children: [
                                {
                                    id   : 'profile',
                                    title: 'Perfil',
                                    type : 'basic',
                                    icon : 'heroicons_outline:user-circle',
                                    link : '/profile-empre'
                                }
                            ]
                        }
                    ];
                    break;


                    case 'CLIENTE':
                    newNavigation = [
                        {
                            id      : 'productos',
                            title   : 'Productos',
                            subtitle: 'Tipo de productos',
                            type    : 'group',
                            icon    : 'memory',
                            children: [
                                {
                                    id   : 'productos',
                                    title: 'Productos',
                                    type : 'basic',
                                    icon : 'heroicons_outline:chart-pie',
                                    link : '/prod-cli'
                                },
                                {
                                    id   : 'servicios',
                                    title: 'Servicios',
                                    type : 'basic',
                                    icon : 'heroicons_outline:chart-pie',
                                    link : '/serv-cli'
                                }
                            ],
    
                        },

    
                        {
                            id      : 'perfil',
                            title   : 'Perfil',
                            subtitle: 'Información personal',
                            type    : 'group',
                            icon    : 'memory',
                            children: [
                                {
                                    id   : 'profile',
                                    title: 'Perfil',
                                    type : 'basic',
                                    icon : 'heroicons_outline:user-circle',
                                    link : '/profile-cli'
                                }
                            ]
                        }
                    ];
                    break;
    
            default:
                newNavigation = [
                    // Opciones de navegación predeterminadas para roles desconocidos o no válidos
                ];
        }
    
        // Obtén el componente de navegación
        const navComponent = this._fuseNavigationService.getComponent<FuseVerticalNavigationComponent>(navigationName);
    
        // Actualiza las opciones de navegación y refresca el componente
        if (navComponent) {
            navComponent.navigation = newNavigation;
            navComponent.refresh();
        }
    }
}
