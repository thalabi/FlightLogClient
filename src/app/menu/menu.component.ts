import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    menuModel: MenuItem[] = [
        {
            label: 'Home',
            routerLink: 'flightLogTable',
            // routerLinkActiveOptions: { exact: true }
        },
        // {
        //     label: 'Print',
        //     routerLink: '/print',
        //     routerLinkActiveOptions: { exact: true }
        // },
        {
            label: 'Misc',
            items: [
                { label: 'Make & Model', routerLink: 'testArraySort/makeModel', routerLinkActiveOptions: { exact: true }},
                { label: 'Registration', routerLink: 'testArraySort/registration', routerLinkActiveOptions: { exact: true }},
                { label: 'Pilot/Passenger', routerLink: 'testArraySort/pilot', routerLinkActiveOptions: { exact: true }},
            ]
        },
        // {
        //     label: 'About',
        //     routerLink: '/about',
        //     routerLinkActiveOptions: { exact: true }
        // },
        // {
        //     label: 'Contact Us',
        //     routerLink: '/contact-us',
        //     routerLinkActiveOptions: { exact: true },
        //     badge: 'My Badge'
        // },
        // {
        //     label: 'Logout',
        //     routerLink: '/login',
        //     routerLinkActiveOptions: { exact: true }
        // }
    ];

    constructor() { }

    ngOnInit() {
    }

}
