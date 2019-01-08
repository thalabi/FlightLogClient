
export class FormAttributes {
    formTitle: string;
    tableName: string;
    queryOrderByColumns: Array<string>;
    fields: Array<FieldAttributes>;
    showReplicationStatus: boolean
}
export enum DataTypeEnum {
    STRING,
    NUMBER,
    DATE, // Holds date
    DATE_TIME // Holds date & time
}

export enum UiComponentEnum {
    TEXT, CALENDAR, TEXT_AREA, BOOLEAN_CHECKBOX, PASSWORD        
}

export class FieldAttributes {
    columnName: string;
    dataType: DataTypeEnum;
    orderNumber: number;
    header: string;
    uiComponentType: UiComponentEnum;
    pipe?: string;
    headerStyle?: any;
    filterStyle?: any;
    textAreaRows?: number;
    textAreaColumns?: number;
}
export class CrudComponentConfig {

    private static airport: FormAttributes = {
        formTitle: 'Airport',
        tableName: 'airport',
        queryOrderByColumns: ['country','province','name'],
        fields: [
            {columnName: 'identifier', dataType: DataTypeEnum.STRING, orderNumber: 1, header: 'Identifier', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}},
            {columnName: 'name', dataType: DataTypeEnum.STRING, orderNumber: 2, header: 'Name', uiComponentType: UiComponentEnum.TEXT, filterStyle: {width: '20rem'}},
            {columnName: 'province', dataType: DataTypeEnum.STRING, orderNumber: 3, header: 'Province', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}},
            {columnName: 'city', dataType: DataTypeEnum.STRING, orderNumber: 4, header: 'City', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '10rem'}, filterStyle: {width: '7rem'}},
            {columnName: 'country', dataType: DataTypeEnum.STRING, orderNumber: 5, header: 'Country', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}},
            {columnName: 'latitude', dataType: DataTypeEnum.NUMBER, orderNumber: 6, header: 'Latitude', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}},
            {columnName: 'longitude', dataType: DataTypeEnum.NUMBER, orderNumber: 7, header: 'Longitude', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}},
            {columnName: 'upperWindsStationId', dataType: DataTypeEnum.STRING, orderNumber: 8, header: 'U Wnd Id', uiComponentType: UiComponentEnum.TEXT, headerStyle: {width: '6rem'}, filterStyle: {width: '3rem'}},
            ],
        showReplicationStatus: false
    };

    private static makeModel: FormAttributes = {
        formTitle: 'MakeModel',
        tableName: 'makeModel',
        queryOrderByColumns: ['makeModel'],
        fields: [
            {columnName: 'makeModel', dataType: DataTypeEnum.STRING, orderNumber: 1, header: 'MakeModel', uiComponentType: UiComponentEnum.TEXT}
            ],
        showReplicationStatus: true
    };

    private static pilot: FormAttributes = {
        formTitle: 'Pilot/Passenger',
        tableName: 'pilot',
        queryOrderByColumns: ['pilot'],
        fields: [
            {columnName: 'pilot', dataType: DataTypeEnum.STRING, orderNumber: 1, header: 'Pilot/Passenger', uiComponentType: UiComponentEnum.TEXT}
            ],
        showReplicationStatus: true
    };

    private static registration: FormAttributes = {
        formTitle: 'Registration',
        tableName: 'registration',
        queryOrderByColumns: ['registration'],
        fields: [
            {columnName: 'registration', dataType: DataTypeEnum.STRING, orderNumber: 1, header: 'Registration', uiComponentType: UiComponentEnum.TEXT}
            ],
        showReplicationStatus: true
    };

    private static significantEvent: FormAttributes = {
        formTitle: 'Significant Event',
        tableName: 'significantEvent',
        queryOrderByColumns: ['eventDate'],
        fields: [
            {columnName: 'eventDate', dataType: DataTypeEnum.DATE, orderNumber: 1, header: 'Date', headerStyle: {width: '7rem'}, uiComponentType: UiComponentEnum.CALENDAR, pipe: 'date-yyyy-mm-dd', filterStyle: {width: '6rem'}},
            {columnName: 'eventDescription', dataType: DataTypeEnum.STRING, orderNumber: 2, header: 'Description', uiComponentType: UiComponentEnum.TEXT_AREA, textAreaRows: 4, textAreaColumns: 30}
            ],
        showReplicationStatus: true
    };

    private static user: FormAttributes = {
        formTitle: 'User',
        tableName: 'user',
        queryOrderByColumns: ['username'],
        fields: [
            {columnName: 'username', dataType: DataTypeEnum.STRING, orderNumber: 1, header: 'Username', uiComponentType: UiComponentEnum.TEXT},
            {columnName: 'password', dataType: DataTypeEnum.STRING, orderNumber: 1, header: 'Password', uiComponentType: UiComponentEnum.PASSWORD, pipe: 'password'},
            {columnName: 'enabled', dataType: DataTypeEnum.STRING, orderNumber: 1, header: 'Enabled', uiComponentType: UiComponentEnum.BOOLEAN_CHECKBOX},
            {columnName: 'firstName', dataType: DataTypeEnum.STRING, orderNumber: 1, header: 'First name', uiComponentType: UiComponentEnum.TEXT},
            {columnName: 'lastName', dataType: DataTypeEnum.STRING, orderNumber: 1, header: 'Last name', uiComponentType: UiComponentEnum.TEXT}
            ],
        showReplicationStatus: false
    };

    static formConfig: Map<string, FormAttributes> = new Map([
        ['airport', CrudComponentConfig.airport],
        ['makeModel', CrudComponentConfig.makeModel],
        ['pilot', CrudComponentConfig.pilot],
        ['registration', CrudComponentConfig.registration],
        ['significantEvent', CrudComponentConfig.significantEvent],
        ['user', CrudComponentConfig.user]
    ]);
}
