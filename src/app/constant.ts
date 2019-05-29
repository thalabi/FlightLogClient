import { PermissionEnum } from "./security/permission-enum";

export class Constant {
    static TIMESTAMP_PATTERN = /^\s*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s*(\d{1,2})\s*,?\s*(\d{4})\s*(\d{1,2})\s*:?\s*(\d{1,2})\s*(am|pm)\s*$/i;
    static MONTHS: string[] = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    static APPLICATION_PROPERTIES_FILE = 'assets/application.properties.json';
    static entityToWritePermissionMap: Map<string, PermissionEnum> = new Map([
        ['airport', PermissionEnum.AIRPORT_WRITE],
        ['makeModel', PermissionEnum.MAKE_MODEL_WRITE],
        ['pilot', PermissionEnum.PILOT_WRITE],
        ['registration', PermissionEnum.REGISTRATION_WRITE],
        ['significantEvent', PermissionEnum.SIGNIFICANT_EVENT_WRITE],
        ['user', PermissionEnum.USER_WRITE],
        ['group', PermissionEnum.GROUP_WRITE],
        ['part', PermissionEnum.PART_WRITE],
        ['component', PermissionEnum.COMPONENT_WRITE]
    ]);
}