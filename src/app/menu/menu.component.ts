import { Component, OnInit } from '@angular/core';
import { CustomMenuItem } from './custom-menu-item';
import { MenuItems } from './menu-items';
import { MenuItem } from 'primeng/api/menuitem';
import { AuthService, UserInfo } from '../auth/auth.service';
import { SessionService } from '../service/session.service';

import { distinctUntilChanged } from 'rxjs';
import { PermissionEnum } from './permission-enum';
import { MenubarModule } from 'primeng/menubar';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css'],
    imports: [MenubarModule]
})
export class MenuComponent implements OnInit {

    userInfo!: UserInfo;

    menuModel!: Array<CustomMenuItem>;

    constructor(private authService: AuthService, private sessionService: SessionService
        , private menuItems: MenuItems) { }

    ngOnInit() {
        console.log('menu component')
        this.authService.isAuthenticated$
            .pipe(distinctUntilChanged())
            .subscribe(authenticated => {
                console.log('authenticated', authenticated)
                if (authenticated) {
                    // this.items = userMenuItems
                    this.menuModel = this.menuItems.menuModel;
                    this.sessionService.userInfo$.subscribe(userInfo => {
                        this.userInfo = userInfo
                        console.log('userInfo', this.userInfo)
                        console.log('userInfo.backEndAuthorities', this.userInfo.backEndAuthorities)
                        this.menuModel = this.menuItems.menuModel;
                    })
                } else {
                    this.menuModel = [
                        { label: 'Login', command: () => this.authService.login() }
                    ];
                }
            })

    }

    // show the menu item and submenu item depending the user's permissions
    public showMenuItems(show: boolean): void {
        console.log('showMenuItems begin')
        console.log('user', this.userInfo)
        if (show) {
            this.findMenuItem(this.menuModel, 'flightLogTable').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.FLIGHT_LOG_READ, PermissionEnum.FLIGHT_LOG_WRITE);
            this.findMenuItem(this.menuModel, 'summary').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.SUMMARY);

            this.findMenuItem(this.menuModel, 'misc').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.AIRPORT_READ, PermissionEnum.MAKE_MODEL_READ, PermissionEnum.PILOT_READ, PermissionEnum.REGISTRATION_READ, PermissionEnum.SIGNIFICANT_EVENT_READ);
            this.findMenuItem(this.menuModel, 'airport').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.AIRPORT_READ);
            this.findMenuItem(this.menuModel, 'makeModel').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.MAKE_MODEL_READ);
            this.findMenuItem(this.menuModel, 'pilot').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.PILOT_READ);
            this.findMenuItem(this.menuModel, 'registration').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.REGISTRATION_READ);
            this.findMenuItem(this.menuModel, 'significantEvent').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.SIGNIFICANT_EVENT_READ);

            this.findMenuItem(this.menuModel, 'jobs').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.AIRPORT_SYNC, PermissionEnum.FLIGHT_LOG_SYNC, PermissionEnum.MAKE_MODEL_SYNC, PermissionEnum.PILOT_SYNC, PermissionEnum.REGISTRATION_SYNC, PermissionEnum.SIGNIFICANT_EVENT_SYNC);

            this.findMenuItem(this.menuModel, 'acMaint').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.PART_READ, PermissionEnum.PART_WRITE, PermissionEnum.COMPONENT_READ, PermissionEnum.COMPONENT_WRITE);
            this.findMenuItem(this.menuModel, 'part').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.PART_READ, PermissionEnum.PART_WRITE);
            this.findMenuItem(this.menuModel, 'aircraftComponent').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.COMPONENT_READ, PermissionEnum.COMPONENT_WRITE);

            this.findMenuItem(this.menuModel, 'security').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.USER_READ, PermissionEnum.GROUP_READ);
            this.findMenuItem(this.menuModel, 'user').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.USER_READ);
            this.findMenuItem(this.menuModel, 'group').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.GROUP_READ);
            // TODO change to correct permission enum
            this.findMenuItem(this.menuModel, 'copy_user').visible = MenuComponent.isHolderOfAnyRole(this.userInfo, PermissionEnum.GROUP_READ);

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
        console.log('showMenuItems end')
    }

    // Look for the id of the menu item or submenu item
    private findMenuItem(array: Array<MenuItem>, id: string): any {
        for (const item of array) {
            if (item.id === id) {
                return item;
            } else {
                if (item.items) {
                    const subItems: Array<MenuItem> = <Array<MenuItem>>item.items;
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

    public static isHolderOfAnyRole(userInfo: UserInfo, ...givenRoles: string[]): boolean {
        return userInfo.roles.find(role => {
            return givenRoles.find(givenRole => givenRole === role) !== undefined
        }) !== undefined;
    }

    login() {
        this.authService.login()
    }

    logout() {
        this.authService.logout();
    }

}
