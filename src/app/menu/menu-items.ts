import { CustomMenuItem } from "./custom-menu-item";
import { PermissionEnum } from "../security/permission-enum";

export class MenuItems {
    menuModel: Array<CustomMenuItem> = [
        {id: 'flightLogTable', label: 'Log', routerLink: 'flightLogTable', permissionEnumArray: [PermissionEnum.FLIGHT_LOG_READ, PermissionEnum.FLIGHT_LOG_WRITE]},
        {id: 'summary', label: 'Summary',
            items: [
                { label: 'Monthly Report', routerLink: 'flightLogMonthlyTotalVTable', routerLinkActiveOptions: { exact: true }},
                { label: 'Yearly Report', routerLink: 'flightLogYearlyTotalVTable', routerLinkActiveOptions: { exact: true }},
                { label: 'Last X Days Report', routerLink: 'flightLogLastXDaysTotalVTableComponent', routerLinkActiveOptions: { exact: true }},
            ],
            permissionEnumArray: [PermissionEnum.SUMMARY]
        },
        {id: 'misc', label: 'Misc',
            items: [
                { id: 'airport', label: 'Airport', routerLink: 'genericCrud/airport', routerLinkActiveOptions: { exact: true }},
                { id: 'make_model', label: 'Make & Model', routerLink: 'genericCrud/makeModel', routerLinkActiveOptions: { exact: true }},
                { id: 'pilot', label: 'Pilot/Passenger', routerLink: 'genericCrud/pilot', routerLinkActiveOptions: { exact: true }},
                { id: 'registration', label: 'Registration', routerLink: 'genericCrud/registration', routerLinkActiveOptions: { exact: true }},
                { id: 'significant_event', label: 'Significant Event', routerLink: 'genericCrud/significantEvent', routerLinkActiveOptions: { exact: true }},
            ],
            permissionEnumArray: [PermissionEnum.AIRPORT_READ, PermissionEnum.MAKE_MODEL_READ, PermissionEnum.PILOT_READ, PermissionEnum.REGISTRATION_READ, PermissionEnum.SIGNIFICANT_EVENT_READ]
        },
        {id: 'jobs', label: 'Jobs', routerLink: 'jobLauncher',
            permissionEnumArray: [PermissionEnum.AIRPORT_SYNC, PermissionEnum.FLIGHT_LOG_SYNC, PermissionEnum.MAKE_MODEL_SYNC, PermissionEnum.PILOT_SYNC, PermissionEnum.REGISTRATION_SYNC, PermissionEnum.SIGNIFICANT_EVENT_SYNC]},
        {id: 'acMaint', label: 'A/C Maint', permissionEnumArray: [PermissionEnum.PART_READ, PermissionEnum.PART_WRITE, PermissionEnum.COMPONENT_READ, PermissionEnum.COMPONENT_WRITE],
            items: [
                { id: 'part', label: 'Part', routerLink: 'genericCrud/part', routerLinkActiveOptions: { exact: true }, permissionEnumArray: [PermissionEnum.PART_READ, PermissionEnum.PART_WRITE]},
                { id: 'aircraftComponent', label: 'Component', routerLink: 'aircraftComponent', routerLinkActiveOptions: { exact: true }, permissionEnumArray: [PermissionEnum.COMPONENT_READ, PermissionEnum.COMPONENT_WRITE]},
            ]
        },
        {id: 'security', label: 'Security', permissionEnumArray: [PermissionEnum.USER_READ, PermissionEnum.GROUP_READ],
            items: [
                { id: 'user', label: 'User', routerLink: 'genericCrud/user', routerLinkActiveOptions: { exact: true },
                    permissionEnumArray: [PermissionEnum.USER_READ]},
                { id: 'group', label: 'Group', routerLink: 'genericCrud/group', routerLinkActiveOptions: { exact: true },
                    permissionEnumArray: [PermissionEnum.GROUP_READ]},
                { id: 'copy_user', label: 'Copy User', routerLink: 'copyUser', routerLinkActiveOptions: { exact: true },
                    permissionEnumArray: [PermissionEnum.GROUP_READ]},
            ]
        },
        {id: 'logout', icon: 'pi pi-fw pi-cog',
            items: [
                { label: 'Change Password', routerLink: 'changePassword', routerLinkActiveOptions: { exact: true }},
                { label: 'Logout', routerLink: 'login', routerLinkActiveOptions: { exact: true }},
            ]
        },
    ];
}