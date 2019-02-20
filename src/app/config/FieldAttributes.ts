import { DataTypeEnum } from "./DataTypeEnum";
import { UiComponentEnum } from "./UiComponentEnum";
import { AssociationAttributes } from "./AssociationAttributes";
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
    isPartOfTemplateForm: boolean; // MANY_TO_MANY associations are displayed as pick lists which are not defined in template form
    associationAttributes?: AssociationAttributes;
}
