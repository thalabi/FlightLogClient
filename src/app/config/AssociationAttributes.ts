import { IGenericEntity } from "../domain/i-gerneric-entity";
import { AssociationTypeEnum } from "./AssociationTypeEnum";

export class AssociationAttributes {
    associationTableName: string;
    associationPropertyName: string;
    orderByColumns: Array<string>;
    associationTypeEnum: AssociationTypeEnum;
    propertyAsName: string; // property to display in dropdown or picklist
    propertyAsDescription?: string; // property too display in picklist tooltip
    mandatory?: boolean;
    optionsArray?: Array<IGenericEntity>; // used as value of 'options' attribute in p-dropdown
}
