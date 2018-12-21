import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { SessionDataService } from '../service/session-data.service';
import { User } from '../security/user';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    user: User;

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
                { label: 'Significant Event', routerLink: 'genericCrud/significantEvent', routerLinkActiveOptions: { exact: true }},
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
        {label: 'Logout',   routerLink: 'login'},
    ];

    constructor(private sessionDataService: SessionDataService) { }

    ngOnInit() {
        this.sessionDataService.userSubject
            //.map((data:User)=>{console.log(data})
            .subscribe(
            data => {
                this.user = data;
                console.log('user: ', this.user);
                this.showMenuItems(this.user != undefined && this.user != null);
            },
            error => console.error(error),
            () => console.log('completed')
            );
    }

    private getMenuItem(array: any, label: string): any {
        return array.find(item => item.label === label);
    }

    public showMenuItems(show: boolean): void {
        //const topLevel = this.getMenuItem(this.menuModel, 'Top Level Menu');
        if (show) {
            this.getMenuItem(this.menuModel, 'Home').visible = true;
            this.getMenuItem(this.menuModel, 'Summary').visible = true;
            this.getMenuItem(this.menuModel, 'Misc').visible = true;
            this.getMenuItem(this.menuModel, 'Jobs').visible = true;
            this.getMenuItem(this.menuModel, 'Logout').visible = true;
        } else {
            this.getMenuItem(this.menuModel, 'Home').visible = false;
            this.getMenuItem(this.menuModel, 'Summary').visible = false;
            this.getMenuItem(this.menuModel, 'Misc').visible = false;
            this.getMenuItem(this.menuModel, 'Jobs').visible = false;
            this.getMenuItem(this.menuModel, 'Logout').visible = false;
        }
    }

}
