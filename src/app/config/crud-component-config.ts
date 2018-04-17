export class FieldAttributes {columnName: string; dataType: string; orderNumber: number; header: string; uiComponentType: string; pipe?: string; headerStyle?: any}
export class FormAttributes {
    formTitle: string;
    tableName: string;
    queryOrderByColumns: Array<string>;
    fields: Array<FieldAttributes>;
}
export class CrudComponentConfig {

    private static registration: FormAttributes = {
        formTitle: 'Registration',
        tableName: 'registration',
        queryOrderByColumns: ['registration'],
        fields: [
            {columnName: 'registration', dataType: 'string', orderNumber: 1, header: 'Registration', uiComponentType: 'calendar'}
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

    static formConfig: Map<string, FormAttributes> = new Map([
        ['significantEvent', CrudComponentConfig.significantEvent],
        ['registration', CrudComponentConfig.registration]
    ]);
}
