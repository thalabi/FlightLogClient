//import { MenuItem } from "primeng/primeng";
import { MenuItem } from "primeng/api";
import { PermissionEnum } from "./permission-enum";

export interface CustomMenuItem extends MenuItem {
    // @Override
    //items?: CustomMenuItem[] | CustomMenuItem[][]; // override items in MenuItem
    items?: CustomMenuItem[]; // override items in MenuItem
    permissionEnumArray?: Array<PermissionEnum>; // holds permissions any of which are required for this menu item
}