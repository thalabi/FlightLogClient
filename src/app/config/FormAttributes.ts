import { FieldAttributes } from "./FieldAttributes";
import { AssociationAttributes } from "./AssociationAttributes";
export class FormAttributes {
    formTitle: string;
    tableName: string;
    queryOrderByColumns: Array<string>;
    fields: Array<FieldAttributes>;
    showReplicationStatus: boolean;
    associations: Array<AssociationAttributes>;
}
