import { AssociationAttributes } from "./AssociationAttributes";
import { FieldAttributes } from "./FieldAttributes";
export class FormAttributes {
    formTitle: string;
    tableName: string;
    queryOrderByColumns: Array<string>;
    fields: Array<FieldAttributes>;
    showReplicationStatus: boolean;
    associations: Array<AssociationAttributes>;
}
