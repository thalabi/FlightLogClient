import { UiComponentEnum } from "./UiComponentEnum";
import { DataTypeEnum } from "./DataTypeEnum";
import { AssociationAttributes } from "./AssociationAttributes";
import { FieldAffinityEnum } from "./FieldAffinityEnum";
export class FieldAttributes {
    columnName: string;
    dataType: DataTypeEnum;
    mandatory: boolean;
    orderNumber?: number; // it appears that this property is not used. TODO remove
    header: string;
    uiComponentType: UiComponentEnum;
    pipe?: string;
    headerStyle?: any;
    filterStyle?: any;
    textAreaRows?: number;
    textAreaColumns?: number;
    fieldAffinity: Array<FieldAffinityEnum>; // whether to be included in data table, imput form or db entity
    //isPartOfTemplateForm: boolean; // MANY_TO_MANY associations are displayed as pick lists which are not defined in template form
    associationAttributes?: AssociationAttributes;
}
