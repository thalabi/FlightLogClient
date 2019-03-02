import { UiComponentEnum } from "./UiComponentEnum";
import { DataTypeEnum } from "./DataTypeEnum";
import { AssociationAttributes } from "./AssociationAttributes";
import { ComponentEnum } from "./ComponentEnum";
export class FieldAttributes {
    columnName: string;
    dataType: DataTypeEnum;
    mandatory: boolean;
    orderNumber: number;
    header: string;
    uiComponentType: UiComponentEnum;
    pipe?: string;
    headerStyle?: any;
    filterStyle?: any;
    textAreaRows?: number;
    textAreaColumns?: number;
    includeInComponent: Array<ComponentEnum>; // whether to be included in data table or imput form
    //isPartOfTemplateForm: boolean; // MANY_TO_MANY associations are displayed as pick lists which are not defined in template form
    associationAttributes?: AssociationAttributes;
}
