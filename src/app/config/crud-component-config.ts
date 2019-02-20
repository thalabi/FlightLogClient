import { PermissionEnum } from "../security/permission-enum";
import { DataTypeEnum } from "./DataTypeEnum";
import { FormAttributes } from "./FormAttributes";
import { UiComponentEnum } from "./UiComponentEnum";
import { EntityAttributes } from "./EntityAttributes";
import { AssociationTypeEnum } from "./AssociationTypeEnum";

export class CrudComponentConfig {

    private static airport: FormAttributes = {
        formTitle: 'Airport',
        tableName: 'airport',
        queryOrderByColumns: ['country','province','name'],
        fields: [
            {columnName: 'identifier', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 1, header: 'Identifier', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}, isPartOfTemplateForm: true},
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 2, header: 'Name', uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '20rem'}, isPartOfTemplateForm: true},
            {columnName: 'province', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 3, header: 'Province', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}, isPartOfTemplateForm: true},
            {columnName: 'city', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 4, header: 'City', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '10rem'}, filterStyle: {width: '7rem'}, isPartOfTemplateForm: true},
            {columnName: 'country', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 5, header: 'Country', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}, isPartOfTemplateForm: true},
            {columnName: 'latitude', dataType: DataTypeEnum.NUMBER, mandatory: false, orderNumber: 6, header: 'Latitude', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}, isPartOfTemplateForm: true},
            {columnName: 'longitude', dataType: DataTypeEnum.NUMBER, mandatory: false, orderNumber: 7, header: 'Longitude', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}, isPartOfTemplateForm: true},
            {columnName: 'upperWindsStationId', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 8, header: 'U Wnd Id', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6rem'}, filterStyle: {width: '3rem'}, isPartOfTemplateForm: true},
            ],
        showReplicationStatus: false,
        associations: []
    };

    private static makeModel: FormAttributes = {
        formTitle: '',
        tableName: 'makeModel',
        queryOrderByColumns: ['makeModel'],
        fields: [
            {columnName: 'makeModel', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'MakeModel', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true}
            ],
        showReplicationStatus: true,
        associations: []
    };

    private static pilot: FormAttributes = {
        formTitle: '',
        tableName: 'pilot',
        queryOrderByColumns: ['pilot'],
        fields: [
            {columnName: 'pilot', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Pilot/Passenger', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true}
            ],
        showReplicationStatus: true,
        associations: []
    };

    private static registration: FormAttributes = {
        formTitle: '',
        tableName: 'registration',
        queryOrderByColumns: ['registration'],
        fields: [
            {columnName: 'registration', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Registration', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true}
            ],
        showReplicationStatus: true,
        associations: []
    };

    private static significantEvent: FormAttributes = {
        formTitle: 'Significant Event',
        tableName: 'significantEvent',
        queryOrderByColumns: ['eventDate'],
        fields: [
            {columnName: 'eventDate', dataType: DataTypeEnum.DATE, mandatory: true, orderNumber: 1, header: 'Date', headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '6rem'}, isPartOfTemplateForm: true},
            {columnName: 'eventDescription', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 2, header: 'Description', uiComponentType: UiComponentEnum.TEXT_AREA, textAreaRows: 4, textAreaColumns: 30, isPartOfTemplateForm: true}
            ],
        showReplicationStatus: true,
        associations: []
    };

    private static user: FormAttributes = {
        formTitle: 'User',
        tableName: 'user',
        queryOrderByColumns: ['username'],
        fields: [
            {columnName: 'username', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Username', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true},
            {columnName: 'password', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 2, header: 'Password', uiComponentType: UiComponentEnum.PASSWORD, pipe: 'password', isPartOfTemplateForm: true},
            {columnName: 'enabled', dataType: DataTypeEnum.BOOLEAN, mandatory: false, orderNumber: 3, header: 'Enabled', uiComponentType: UiComponentEnum.BOOLEAN_CHECKBOX, isPartOfTemplateForm: true},
            {columnName: 'firstName', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 4, header: 'First name', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true},
            {columnName: 'lastName', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 5, header: 'Last name', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true}
            ],
        showReplicationStatus: false,
        associations: [
            {tableName: 'group', associationPropertyName: 'groupSet', orderByColumns: ['name'],
            associationTypeEnum: AssociationTypeEnum.MANY_TO_MANY,  propertyAsName: 'name', propertyAsDescription: 'description'}
        ]
    };

    private static group: FormAttributes = {
        formTitle: 'Group',
        tableName: 'group',
        queryOrderByColumns: ['name'],
        fields: [
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Name', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true},
            {columnName: 'description', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 2, header: 'Description', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true},
            ],
        showReplicationStatus: false,
        associations: [
            {tableName: 'permission', associationPropertyName: 'permissionSet', orderByColumns: ['name'],
            associationTypeEnum: AssociationTypeEnum.MANY_TO_MANY,  propertyAsName: 'name', propertyAsDescription: 'description'}
        ]
    };

    private static part: FormAttributes = {
        formTitle: 'Part',
        tableName: 'part',
        queryOrderByColumns: ['name'],
        fields: [
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Name', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true},
            {columnName: 'description', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 2, header: 'Description', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true},
            ],
        showReplicationStatus: false,
        associations: []
    };

    private static component: FormAttributes = {
        formTitle: 'Component',
        tableName: 'component',
        queryOrderByColumns: ['name'],
        fields: [
            {columnName: 'name', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 1, header: 'Name', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true},
            {columnName: 'description', dataType: DataTypeEnum.STRING, mandatory: false, orderNumber: 2, header: 'Description', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true},
            {columnName: 'part', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 3, header: 'Part',
                uiComponentType: UiComponentEnum.DROPDOWN, headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'},
                isPartOfTemplateForm: true,
                associationAttributes: {tableName: 'part', associationPropertyName: 'part', orderByColumns: ['name'],
                    associationTypeEnum: AssociationTypeEnum.MANY_TO_ONE, propertyAsName: 'name', mandatory: true, optionsArray: null}},
            {columnName: 'workPerformed', dataType: DataTypeEnum.STRING, mandatory: true, orderNumber: 4, header: 'Work performed', uiComponentType: UiComponentEnum.TEXT, isPartOfTemplateForm: true},
            {columnName: 'datePerformed', dataType: DataTypeEnum.DATE, mandatory: true, orderNumber: 5, header: 'Date performed',
                headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd',
                filterStyle: {width: '6rem'}, isPartOfTemplateForm: true},
            {columnName: 'hoursPerformed', dataType: DataTypeEnum.NUMBER, mandatory: false, orderNumber: 6, header: 'Hours performed',
                uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'},
                isPartOfTemplateForm: true},
            {columnName: 'dateDue', dataType: DataTypeEnum.DATE, mandatory: false, orderNumber: 7, header: 'Date due',
                headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '6rem'},
                isPartOfTemplateForm: true},
            {columnName: 'hoursDue', dataType: DataTypeEnum.NUMBER, mandatory: false, orderNumber: 8, header: 'Hours due',
                uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}, isPartOfTemplateForm: true},

            ],
        showReplicationStatus: false,
        associations: [
            {tableName: 'part', associationPropertyName: 'part', orderByColumns: ['name'],
            associationTypeEnum: AssociationTypeEnum.MANY_TO_ONE, propertyAsName: 'name', mandatory: true}
        ]
    };

    static formConfig: Map<string, FormAttributes> = new Map([
        ['airport', CrudComponentConfig.airport],
        ['makeModel', CrudComponentConfig.makeModel],
        ['pilot', CrudComponentConfig.pilot],
        ['registration', CrudComponentConfig.registration],
        ['significantEvent', CrudComponentConfig.significantEvent],
        ['user', CrudComponentConfig.user],
        ['group', CrudComponentConfig.group],
        ['part', CrudComponentConfig.part],
        ['component', CrudComponentConfig.component]
    ]);

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

    // static entityAttributesMap: EntityAttributes = {
    //     columnDefaultValue: new Map([
    //         ['component', true]
    //     ])
    // }

    private static componentEntityAttributes: EntityAttributes = {
        columnDefaultValueMap: new Map([
            ['deleted', false]
        ])
    }
    static entityAttributesMap: Map<String, EntityAttributes> = new Map([
        ['component', CrudComponentConfig.componentEntityAttributes]
    ]);

}
