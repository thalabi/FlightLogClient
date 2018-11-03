export class FormAttributes {
    formTitle: string;
    tableName: string;
    queryOrderByColumns: Array<string>;
    fields: Array<FieldAttributes>
}
export enum DataTypeEnum {
    String,
    Number,
    Date, // Holds date
    DateTime // Holds date & time
}

export class FieldAttributes {
    columnName: string;
    dataType: DataTypeEnum;
    orderNumber: number;
    header: string;
    uiComponentType: string;
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
            {columnName: 'identifier', dataType: DataTypeEnum.String, orderNumber: 1, header: 'Identifier', uiComponentType: 'text', headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}},
            {columnName: 'name', dataType: DataTypeEnum.String, orderNumber: 2, header: 'Name', uiComponentType: 'text', filterStyle: {width: '20rem'}},
            {columnName: 'province', dataType: DataTypeEnum.String, orderNumber: 3, header: 'Province', uiComponentType: 'text', headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}},
            {columnName: 'city', dataType: DataTypeEnum.String, orderNumber: 4, header: 'City', uiComponentType: 'text', headerStyle: {width: '10rem'}, filterStyle: {width: '7rem'}},
            {columnName: 'country', dataType: DataTypeEnum.String, orderNumber: 5, header: 'Country', uiComponentType: 'text', headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}},
            {columnName: 'latitude', dataType: DataTypeEnum.Number, orderNumber: 6, header: 'Latitude', uiComponentType: 'text', headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}},
            {columnName: 'longitude', dataType: DataTypeEnum.Number, orderNumber: 7, header: 'Longitude', uiComponentType: 'text', headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}},
            {columnName: 'upperWindsStationId', dataType: DataTypeEnum.String, orderNumber: 8, header: 'U Wnd Id', uiComponentType: 'text', headerStyle: {width: '6rem'}, filterStyle: {width: '3rem'}},
            ]
    };

    private static makeModel: FormAttributes = {
        formTitle: 'MakeModel',
        tableName: 'makeModel',
        queryOrderByColumns: ['makeModel'],
        fields: [
            {columnName: 'makeModel', dataType: DataTypeEnum.String, orderNumber: 1, header: 'MakeModel', uiComponentType: 'text'}
            ]
    };

    private static pilot: FormAttributes = {
        formTitle: 'Pilot/Passenger',
        tableName: 'pilot',
        queryOrderByColumns: ['pilot'],
        fields: [
            {columnName: 'pilot', dataType: DataTypeEnum.String, orderNumber: 1, header: 'Pilot/Passenger', uiComponentType: 'text'}
            ]
    };

    private static registration: FormAttributes = {
        formTitle: 'Registration',
        tableName: 'registration',
        queryOrderByColumns: ['registration'],
        fields: [
            {columnName: 'registration', dataType: DataTypeEnum.String, orderNumber: 1, header: 'Registration', uiComponentType: 'text'}
            ]
    };

    private static significantEvent: FormAttributes = {
        formTitle: 'Significant Event',
        tableName: 'significantEvent',
        queryOrderByColumns: ['eventDate'],
        fields: [
            {columnName: 'eventDate', dataType: DataTypeEnum.Date, orderNumber: 1, header: 'Date', headerStyle: {width: '7rem'}, uiComponentType: 'calendar', pipe: 'date-yyyy-mm-dd', filterStyle: {width: '6rem'}},
            {columnName: 'eventDescription', dataType: DataTypeEnum.String, orderNumber: 2, header: 'Description', uiComponentType: 'textArea', textAreaRows: 4, textAreaColumns: 30}
            ]
    };

    static formConfig: Map<string, FormAttributes> = new Map([
        ['airport', CrudComponentConfig.airport],
        ['makeModel', CrudComponentConfig.makeModel],
        ['pilot', CrudComponentConfig.pilot],
        ['registration', CrudComponentConfig.registration],
        ['significantEvent', CrudComponentConfig.significantEvent]
    ]);
}