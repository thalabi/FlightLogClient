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
        {id: 'home', label: 'Home',   routerLink: 'flightLogTable'},
        {id: 'summary', label: 'Summary',
            items: [
                { label: 'Monthly Report', routerLink: 'flightLogMonthlyTotalVTable', routerLinkActiveOptions: { exact: true }},
                { label: 'Yearly Report', routerLink: 'flightLogYearlyTotalVTable', routerLinkActiveOptions: { exact: true }},
                { label: 'Last X Days Report', routerLink: 'flightLogLastXDaysTotalVTableComponent', routerLinkActiveOptions: { exact: true }},
            ]
        },
        {id: 'misc', label: 'Misc',
            items: [
                { label: 'Airport', routerLink: 'genericCrud/airport', routerLinkActiveOptions: { exact: true }},
                { label: 'Make & Model', routerLink: 'genericCrud/makeModel', routerLinkActiveOptions: { exact: true }},
                { label: 'Pilot/Passenger', routerLink: 'genericCrud/pilot', routerLinkActiveOptions: { exact: true }},
                { label: 'Registration', routerLink: 'genericCrud/registration', routerLinkActiveOptions: { exact: true }},
                { label: 'Significant Event', routerLink: 'genericCrud/significantEvent', routerLinkActiveOptions: { exact: true }},
            ]
        },
        {id: 'jobs', label: 'Jobs', routerLink: 'jobLauncher'},
        {id: 'security', label: 'Security',
            items: [
                { label: 'User', routerLink: 'genericCrud/user', routerLinkActiveOptions: { exact: true }},
                { label: 'Group', routerLink: 'genericCrud/group', routerLinkActiveOptions: { exact: true }},
            ]
        },
        {id: 'logout', icon: 'pi pi-fw pi-cog',
            items: [
                { label: 'Change Password', routerLink: 'changePassword', routerLinkActiveOptions: { exact: true }},
                { label: 'Logout', routerLink: 'login', routerLinkActiveOptions: { exact: true }},
            ]
        },
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

    private getMenuItem(array: any, id: string): any {
        return array.find(item => item.id === id);
    }

    public showMenuItems(show: boolean): void {
        //const topLevel = this.getMenuItem(this.menuModel, 'Top Level Menu');
        if (show) {
            this.getMenuItem(this.menuModel, 'home').visible = true;
            this.getMenuItem(this.menuModel, 'summary').visible = true;
            this.getMenuItem(this.menuModel, 'misc').visible = true;
            this.getMenuItem(this.menuModel, 'jobs').visible = true;
            this.getMenuItem(this.menuModel, 'security').visible = true;
            this.getMenuItem(this.menuModel, 'logout').visible = true;
        } else {
            this.getMenuItem(this.menuModel, 'home').visible = false;
            this.getMenuItem(this.menuModel, 'summary').visible = false;
            this.getMenuItem(this.menuModel, 'misc').visible = false;
            this.getMenuItem(this.menuModel, 'jobs').visible = false;
            this.getMenuItem(this.menuModel, 'security').visible = false;
            this.getMenuItem(this.menuModel, 'logout').visible = false;
        }
    }

}
