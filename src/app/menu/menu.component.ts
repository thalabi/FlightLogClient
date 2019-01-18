import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { SessionDataService } from '../service/session-data.service';
import { User } from '../security/user';
import { PermissionEnum } from '../security/permission-enum';

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
                { id: 'airport', label: 'Airport', routerLink: 'genericCrud/airport', routerLinkActiveOptions: { exact: true }},
                { id: 'make_model', label: 'Make & Model', routerLink: 'genericCrud/makeModel', routerLinkActiveOptions: { exact: true }},
                { id: 'pilot', label: 'Pilot/Passenger', routerLink: 'genericCrud/pilot', routerLinkActiveOptions: { exact: true }},
                { id: 'registration', label: 'Registration', routerLink: 'genericCrud/registration', routerLinkActiveOptions: { exact: true }},
                { id: 'significant_event', label: 'Significant Event', routerLink: 'genericCrud/significantEvent', routerLinkActiveOptions: { exact: true }},
            ]
        },
        {id: 'jobs', label: 'Jobs', routerLink: 'jobLauncher'},
        {id: 'security', label: 'Security',
            items: [
                { id: 'user', label: 'User', routerLink: 'genericCrud/user', routerLinkActiveOptions: { exact: true }},
                { id: 'group', label: 'Group', routerLink: 'genericCrud/group', routerLinkActiveOptions: { exact: true }},
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
                () => console.log('completed, this.user: ', this.user)
            );
    }

    private getMenuItem(array: Array<MenuItem>, id: string): any {
        for (const item of array) {
            if (item.id === id) {
                return item;
            } else {
                if (item.items) {
                    const subItems: Array<MenuItem> = <Array<MenuItem>> item.items;
                    for (const subItem of subItems) {
                        if (subItem.id === id) {
                            return subItem;
                        }
                    }
                }
            }
        }
        return null;
//        return array.find(item => item.id === id);
    }

    public showMenuItems(show: boolean): void {
        //const topLevel = this.getMenuItem(this.menuModel, 'Top Level Menu');
        if (show) {
            this.getMenuItem(this.menuModel, 'home').visible = true;
            this.getMenuItem(this.menuModel, 'summary').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.SUMMARY);
            
            this.getMenuItem(this.menuModel, 'misc').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.AIRPORT_READ, PermissionEnum.MAKE_MODEL_READ, PermissionEnum.PILOT_READ, PermissionEnum.REGISTRATION_READ, PermissionEnum.SIGNIFICANT_EVENT_READ);
            this.getMenuItem(this.menuModel, 'airport').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.AIRPORT_READ);
            this.getMenuItem(this.menuModel, 'make_model').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.MAKE_MODEL_READ);
            this.getMenuItem(this.menuModel, 'pilot').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.PILOT_READ);
            this.getMenuItem(this.menuModel, 'registration').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.REGISTRATION_READ);
            this.getMenuItem(this.menuModel, 'significant_event').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.SIGNIFICANT_EVENT_READ);

            this.getMenuItem(this.menuModel, 'jobs').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.AIRPORT_SYNC, PermissionEnum.FLIGHT_LOG_SYNC, PermissionEnum.MAKE_MODEL_SYNC, PermissionEnum.PILOT_SYNC, PermissionEnum.REGISTRATION_SYNC, PermissionEnum.SIGNIFICANT_EVENT_SYNC);

            this.getMenuItem(this.menuModel, 'security').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.USER_READ, PermissionEnum.GROUP_READ);
            this.getMenuItem(this.menuModel, 'user').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.USER_READ);
            this.getMenuItem(this.menuModel, 'group').visible = this.isHolderOfAnyAuthority(this.user, PermissionEnum.GROUP_READ);
            
            this.getMenuItem(this.menuModel, 'logout').visible = true;
        } else {
            this.getMenuItem(this.menuModel, 'home').visible = false;
            this.getMenuItem(this.menuModel, PermissionEnum.SUMMARY).visible = false;
            this.getMenuItem(this.menuModel, 'misc').visible = false;
            this.getMenuItem(this.menuModel, 'jobs').visible = false;
            this.getMenuItem(this.menuModel, 'security').visible = false;
            this.getMenuItem(this.menuModel, 'logout').visible = false;
        }
    }

    private isHolderOfAnyAuthority(user: User, ...givenAuthorities: string[]): boolean {
        return user.authorities.find(authority => {
            return givenAuthorities.find(givenAuthority => givenAuthority === authority.authority) !== undefined
        }) !== undefined;
    }
}
