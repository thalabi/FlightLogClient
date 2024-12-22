import { FieldAttributes } from "./FieldAttributes";
import { AssociationAttributes } from "./AssociationAttributes";
export interface FormAttributes {
    formTitle: string;
    tableName: string;
    defaultSortColumn: Array<string>;
    fields: Array<FieldAttributes>;
    showReplicationStatus: boolean;
    associations: Array<AssociationAttributes>;
}
