import { Component, OnInit } from '@angular/core';
import { CustomMenuItem } from '../menu/custom-menu-item';
import { MenuItems } from '../menu/menu-items';
import { SessionDataService } from '../service/session-data.service';
import { Router } from '@angular/router';
import { PermissionEnum } from '../security/permission-enum';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(
        private sessionDataService: SessionDataService,
        private router: Router
    ) { }

    ngOnInit() {
        let homePage : string = this.findHomePage();
        console.log('homePage', homePage);
        this.router.navigate([homePage]);
    }

    //
    // Find first menu item that the user has permission to
    //
    private findHomePage () {
        let menuItems: MenuItems = new MenuItems();
        let menuModel: Array<CustomMenuItem> = menuItems.menuModel;
    
        //let menuModel : CustomMenuItem[] = MenuItems.menuModel;
        console.log('menuModel', menuModel);
        if (this.sessionDataService.user) {
            for (const menuItem of menuModel) {
                console.log('menuItem', menuItem);
                if (menuItem.items) {
                    for (const subMenuItem of menuItem.items) {
                        let result: string = this.searchMenuItemPermissionEnumArray(subMenuItem);
                        if (result) {
                            return result
                        }
                    }
                } else {
                    let result: string = this.searchMenuItemPermissionEnumArray(menuItem);
                    if (result) {
                        return result;
                    }
                }
            }
        }
    }

    private searchMenuItemPermissionEnumArray (menuItem: any): any {
        if (menuItem.permissionEnumArray) {
            for (const menuItemPermissionEnum of menuItem.permissionEnumArray) {
                if (this.sessionDataService.user.authorities.find(authority => authority.authority === menuItemPermissionEnum) &&
                    menuItem.routerLink) {
                    return menuItem.routerLink;
                }
            }
        }
    }
}
