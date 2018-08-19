import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    menuModel: MenuItem[] = [
        {label: 'Home',   routerLink: 'flightLogTable'},
        // {
        //     label: 'Print',
        //     routerLink: '/print',
        //     routerLinkActiveOptions: { exact: true }
        // },
        {label: 'Summary',
            items: [
                { label: 'Monthly Report', routerLink: 'flightLogMonthlyTotalVTable', routerLinkActiveOptions: { exact: true }},
                { label: 'Yearly Report', routerLink: 'flightLogYearlyTotalVTable', routerLinkActiveOptions: { exact: true }},
                { label: 'Last X Days Report', routerLink: 'flightLogLastXDaysTotalVTableComponent', routerLinkActiveOptions: { exact: true }},
            ]
        },
        {label: 'Misc',
            items: [
                { label: 'Airport', routerLink: 'genericCrud/airport', routerLinkActiveOptions: { exact: true }},
                { label: 'Make & Model', routerLink: 'genericCrud/makeModel', routerLinkActiveOptions: { exact: true }},
                { label: 'Pilot/Passenger', routerLink: 'genericCrud/pilot', routerLinkActiveOptions: { exact: true }},
                { label: 'Registration', routerLink: 'genericCrud/registration', routerLinkActiveOptions: { exact: true }},
                { label: 'Significant Event', routerLink: 'twoColumnEntityCrud/significantEvent', routerLinkActiveOptions: { exact: true }},
            ]
        },
        {label: 'Jobs',   routerLink: 'jobLauncher'},
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
