import { UiComponentEnum } from "./UiComponentEnum";
import { DataTypeEnum } from "./DataTypeEnum";
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
}
