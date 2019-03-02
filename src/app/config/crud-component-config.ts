import { PermissionEnum } from "../security/permission-enum";
import { UiComponentEnum } from "./UiComponentEnum";
import { DataTypeEnum } from "./DataTypeEnum";
import { FormAttributes } from "./FormAttributes";
import { AssociationTypeEnum } from "./AssociationTypeEnum";
import { ComponentEnum } from "./ComponentEnum";

export class CrudComponentConfig {

    private static includeInBothComponents: Array<ComponentEnum> = [ComponentEnum.DATA_TABLE, ComponentEnum.TEMPLATE_FORM];

    private static airport: FormAttributes = {
        formTitle: 'Airport',
        tableName: 'airport',
        queryOrderByColumns: ['country','province','name'],
        fields: [
            {columnName: 'identifier', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 1, header: 'Identifier', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 2, header: 'Name', uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '20rem'}, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'province', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 3, header: 'Province', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'city', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 4, header: 'City', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '10rem'}, filterStyle: {width: '7rem'}, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'country', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 5, header: 'Country', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'latitude', dataType: DataTypeEnum.NUMBER, mandatory: false, orderNumber: 6, header: 'Latitude', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'longitude', dataType: DataTypeEnum.NUMBER, mandatory: false, orderNumber: 7, header: 'Longitude', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'upperWindsStationId', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 8, header: 'U Wnd Id', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6rem'}, filterStyle: {width: '3rem'}, includeInComponent: CrudComponentConfig.includeInBothComponents},
            ],
        showReplicationStatus: false,
        associations: []
    };

    private static makeModel: FormAttributes = {
        formTitle: '',
        tableName: 'makeModel',
        queryOrderByColumns: ['makeModel'],
        fields: [
            {columnName: 'makeModel', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'MakeModel', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents}
            ],
        showReplicationStatus: true,
        associations: []
    };

    private static pilot: FormAttributes = {
        formTitle: '',
        tableName: 'pilot',
        queryOrderByColumns: ['pilot'],
        fields: [
            {columnName: 'pilot', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Pilot/Passenger', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents}
            ],
        showReplicationStatus: true,
        associations: []
    };

    private static registration: FormAttributes = {
        formTitle: '',
        tableName: 'registration',
        queryOrderByColumns: ['registration'],
        fields: [
            {columnName: 'registration', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Registration', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents}
            ],
        showReplicationStatus: true,
        associations: []
    };

    private static significantEvent: FormAttributes = {
        formTitle: 'Significant Event',
        tableName: 'significantEvent',
        queryOrderByColumns: ['eventDate'],
        fields: [
            {columnName: 'eventDate', dataType: DataTypeEnum.DATE, mandatory: true, orderNumber: 1, header: 'Date', headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '6rem'}, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'eventDescription', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 2, header: 'Description', uiComponentType: UiComponentEnum.TEXT_AREA, textAreaRows: 4, textAreaColumns: 30, includeInComponent: CrudComponentConfig.includeInBothComponents}
            ],
        showReplicationStatus: true,
        associations: []
    };

    private static user: FormAttributes = {
        formTitle: 'User',
        tableName: 'user',
        queryOrderByColumns: ['username'],
        fields: [
            {columnName: 'username', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Username', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'password', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 2, header: 'Password', uiComponentType: UiComponentEnum.PASSWORD, pipe: 'password', includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'enabled', dataType: DataTypeEnum.BOOLEAN, mandatory: false, orderNumber: 3, header: 'Enabled', uiComponentType: UiComponentEnum.BOOLEAN_CHECKBOX, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'firstName', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 4, header: 'First name', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'lastName', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 5, header: 'Last name', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents}
            ],
        showReplicationStatus: false,
        associations: [
            {associationTableName: 'group', associationPropertyName: 'groupSet', orderByColumns: ['name'],
            associationTypeEnum: AssociationTypeEnum.MANY_TO_MANY,  propertyAsName: 'name', propertyAsDescription: 'description'}
        ]
    };

    private static group: FormAttributes = {
        formTitle: 'Group',
        tableName: 'group',
        queryOrderByColumns: ['name'],
        fields: [
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Name', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'description', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 2, header: 'Description', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents},
            ],
        showReplicationStatus: false,
        associations: [
            {associationTableName: 'permission', associationPropertyName: 'permissionSet', orderByColumns: ['name'],
            associationTypeEnum: AssociationTypeEnum.MANY_TO_MANY,  propertyAsName: 'name', propertyAsDescription: 'description'}
        ]
    };

    private static part: FormAttributes = {
        formTitle: 'Part',
        tableName: 'part',
        queryOrderByColumns: ['name'],
        fields: [
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Name', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents},
            {columnName: 'description', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 2, header: 'Description', uiComponentType: UiComponentEnum.TEXT, includeInComponent: CrudComponentConfig.includeInBothComponents}
            ],
        showReplicationStatus: false,
        associations: []
    };

    static formConfig: Map<string, FormAttributes> = new Map([
        ['airport', CrudComponentConfig.airport],
        ['makeModel', CrudComponentConfig.makeModel],
        ['pilot', CrudComponentConfig.pilot],
        ['registration', CrudComponentConfig.registration],
        ['significantEvent', CrudComponentConfig.significantEvent],
        ['user', CrudComponentConfig.user],
        ['group', CrudComponentConfig.group],
        ['part', CrudComponentConfig.part]
    ]);

}
