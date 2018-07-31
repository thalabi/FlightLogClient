export class FormAttributes {
    formTitle: string;
    tableName: string;
    queryOrderByColumns: Array<string>;
    fields: Array<FieldAttributes>
}
export class FieldAttributes {
    columnName: string;
    dataType: string;
    orderNumber: number;
    header: string;
    uiComponentType: string;
    pipe?: string;
    headerStyle?: any;
    filterStyle?: any
}
export class CrudComponentConfig {

    private static registration: FormAttributes = {
        formTitle: 'Registration',
        tableName: 'registration',
        queryOrderByColumns: ['registration'],
        fields: [
            {columnName: 'registration', dataType: 'string', orderNumber: 1, header: 'Registration', uiComponentType: 'text'}
            ]
    };

    private static pilot: FormAttributes = {
        formTitle: 'Pilot/Passenger',
        tableName: 'pilot',
        queryOrderByColumns: ['pilot'],
        fields: [
            {columnName: 'pilot', dataType: 'string', orderNumber: 1, header: 'Pilot/Passenger', uiComponentType: 'text'}
            ]
    };

    private static significantEvent: FormAttributes = {
        formTitle: 'Significant Event',
        tableName: 'significantEvent',
        queryOrderByColumns: ['eventDate'],
        fields: [
            {columnName: 'eventDate', dataType: 'date', orderNumber: 1, header: 'Date', headerStyle: {width: '7rem'}, uiComponentType: 'calendar', pipe: 'date-yyyy-mm-dd'},
            {columnName: 'eventDescription', dataType: 'string', orderNumber: 2, header: 'Description', uiComponentType: 'textArea'}
            ]
    };

    private static airport: FormAttributes = {
        formTitle: 'Airport',
        tableName: 'airport',
        queryOrderByColumns: ['country','province','name'],
        fields: [
            {columnName: 'identifier', dataType: 'string', orderNumber: 1, header: 'Identifier', uiComponentType: 'text', headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}},
            {columnName: 'name', dataType: 'string', orderNumber: 2, header: 'Name', uiComponentType: 'text', filterStyle: {width: '20rem'}},
            {columnName: 'province', dataType: 'string', orderNumber: 3, header: 'Province', uiComponentType: 'text', headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}},
            {columnName: 'city', dataType: 'string', orderNumber: 4, header: 'City', uiComponentType: 'text', headerStyle: {width: '10rem'}, filterStyle: {width: '7rem'}},
            {columnName: 'country', dataType: 'string', orderNumber: 5, header: 'Country', uiComponentType: 'text', headerStyle: {width: '5rem'}, filterStyle: {width: '3rem'}},
            {columnName: 'latitude', dataType: 'number', orderNumber: 6, header: 'Latitude', uiComponentType: 'text', headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}},
            {columnName: 'longitude', dataType: 'number', orderNumber: 7, header: 'Longitude', uiComponentType: 'text', headerStyle: {width: '6.5rem'}, filterStyle: {width: '5rem'}},
            {columnName: 'upperWindsStationId', dataType: 'string', orderNumber: 8, header: 'U Wnd Id', uiComponentType: 'text', headerStyle: {width: '6rem'}, filterStyle: {width: '3rem'}},
            ]
    };

    static formConfig: Map<string, FormAttributes> = new Map([
        ['significantEvent', CrudComponentConfig.significantEvent],
        ['registration', CrudComponentConfig.registration],
        ['pilot', CrudComponentConfig.pilot],
        ['airport', CrudComponentConfig.airport]
    ]);
}
