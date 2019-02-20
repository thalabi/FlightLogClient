import { IGenericEntity } from "../domain/i-gerneric-entity";
import { AssociationTypeEnum } from "./AssociationTypeEnum";

export class AssociationAttributes {
    tableName: string;
    associationPropertyName: string; // example: 'permissionSet' or 'part'
    orderByColumns: Array<string>;
    //isSetAssociation: boolean; // remove
    associationTypeEnum: AssociationTypeEnum;
    propertyAsName: string; // property to display in dropdown or picklist
    propertyAsDescription?: string; // property too display in picklist tooltip
    mandatory?: boolean;
    optionsArray?: Array<IGenericEntity>; // used as value of 'options' attribute in p-dropdown
}
