import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/primeng';
import { SessionDataService } from '../service/session-data.service';
import { User } from '../security/user';
import { PermissionEnum } from '../security/permission-enum';
import { DeviceDetectorService } from 'ngx-device-detector';
import { CustomMenuItem } from './custom-menu-item';
import { MenuItems } from './menu-items';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

    user: User;

    menuItems: MenuItems = new MenuItems();
    menuModel: Array<CustomMenuItem> = this.menuItems.menuModel;

    isDesktop: boolean;

    constructor(private sessionDataService: SessionDataService, private deviceDetectorService: DeviceDetectorService) { }

    ngOnInit() {
        this.isDesktop = this.deviceDetectorService.isDesktop();
        this.showMenuItems(false);
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

    // show the menu item and submenu item depending the user's permissions
    public showMenuItems(show: boolean): void {
        if (show) {
            this.findMenuItem(this.menuModel, 'flightLogTable').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.FLIGHT_LOG_READ, PermissionEnum.FLIGHT_LOG_WRITE);
            this.findMenuItem(this.menuModel, 'summary').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.SUMMARY);
            
            this.findMenuItem(this.menuModel, 'misc').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.AIRPORT_READ, PermissionEnum.MAKE_MODEL_READ, PermissionEnum.PILOT_READ, PermissionEnum.REGISTRATION_READ, PermissionEnum.SIGNIFICANT_EVENT_READ);
            this.findMenuItem(this.menuModel, 'airport').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.AIRPORT_READ);
            this.findMenuItem(this.menuModel, 'make_model').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.MAKE_MODEL_READ);
            this.findMenuItem(this.menuModel, 'pilot').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.PILOT_READ);
            this.findMenuItem(this.menuModel, 'registration').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.REGISTRATION_READ);
            this.findMenuItem(this.menuModel, 'significant_event').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.SIGNIFICANT_EVENT_READ);

            this.findMenuItem(this.menuModel, 'jobs').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.AIRPORT_SYNC, PermissionEnum.FLIGHT_LOG_SYNC, PermissionEnum.MAKE_MODEL_SYNC, PermissionEnum.PILOT_SYNC, PermissionEnum.REGISTRATION_SYNC, PermissionEnum.SIGNIFICANT_EVENT_SYNC);

            this.findMenuItem(this.menuModel, 'acMaint').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.PART_READ, PermissionEnum.PART_WRITE, PermissionEnum.COMPONENT_READ, PermissionEnum.COMPONENT_WRITE);
            this.findMenuItem(this.menuModel, 'part').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.PART_READ, PermissionEnum.PART_WRITE);
            this.findMenuItem(this.menuModel, 'aircraftComponent').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.COMPONENT_READ, PermissionEnum.COMPONENT_WRITE);

            this.findMenuItem(this.menuModel, 'security').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.USER_READ, PermissionEnum.GROUP_READ);
            this.findMenuItem(this.menuModel, 'user').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.USER_READ);
            this.findMenuItem(this.menuModel, 'group').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.GROUP_READ);
            // TODO change to correct permission enum
            this.findMenuItem(this.menuModel, 'copy_user').visible = MenuComponent.isHolderOfAnyAuthority(this.user, PermissionEnum.GROUP_READ);
            
            this.findMenuItem(this.menuModel, 'logout').visible = true;
        } else {
            this.findMenuItem(this.menuModel, 'flightLogTable').visible = false;
            this.findMenuItem(this.menuModel, PermissionEnum.SUMMARY).visible = false;
            this.findMenuItem(this.menuModel, 'misc').visible = false;
            this.findMenuItem(this.menuModel, 'jobs').visible = false;
            this.findMenuItem(this.menuModel, 'acMaint').visible = false;
            this.findMenuItem(this.menuModel, 'security').visible = false;
            this.findMenuItem(this.menuModel, 'logout').visible = false;
        }
    }

    // Look for the id of the menu item or submenu item
    private findMenuItem(array: Array<MenuItem>, id: string): any {
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
    }

    public static isHolderOfAnyAuthority(user: User, ...givenAuthorities: string[]): boolean {
        return user.authorities.find(authority => {
            return givenAuthorities.find(givenAuthority => givenAuthority === authority.authority) !== undefined
        }) !== undefined;
    }
}
