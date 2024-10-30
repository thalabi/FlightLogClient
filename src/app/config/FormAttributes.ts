import { FieldAttributes } from "./FieldAttributes";
import { AssociationAttributes } from "./AssociationAttributes";
export interface FormAttributes {
    formTitle: string;
    tableName: string;
    queryOrderByColumns: Array<string>;
    fields: Array<FieldAttributes>;
    showReplicationStatus: boolean;
    associations: Array<AssociationAttributes>;
}
