import { LazyLoadEvent } from "primeng/primeng";
import { IGenericEntity } from "../domain/i-gerneric-entity";
import { FieldAttributes, DataTypeEnum } from "../config/crud-component-config";
import { ReplicationService } from "../service/replication.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

export class ComponentHelper {

    public static buildSearchString (event: LazyLoadEvent, columnNameArray: string[]): string {
        let search: string = '';
        console.log('columnNameArray', columnNameArray);
        for (let columnName of columnNameArray) {
            if (event.filters[columnName]) {
                // if filter does not start with = < or > then prefix with =
                if (event.filters[columnName].value[0] == '=' || event.filters[columnName].value[0] == '<' || event.filters[columnName].value[0] == '>') {
                    search = search + columnName + event.filters[columnName].value + ',';
                } else {
                    search = search + columnName + encodeURIComponent('=') + event.filters[columnName].value + ',';
                }
            }
        }
        search = search.slice(0, -1); // remove last ,
        console.log('final search', search);
        return search;
    }

    // public static setDateFields(rowArray: Array<IGenericEntity>, fieldAttributesArray: Array<FieldAttributes>) {
    //     rowArray.forEach(row => {
    //         fieldAttributesArray.forEach(fieldAttributes => {
    //             if (fieldAttributes.dataType === DataTypeEnum.Date) {
    //                 row[fieldAttributes.columnName] = new Date(row[fieldAttributes.columnName]);
    //             }
    //         })
    //     })
    // }

    public static getTableReplicationStatusAndLabel(replicationService: ReplicationService, tableName: string): Observable<{"replicationStatus": boolean, "replicationStatusLabel": string}> {

        return replicationService.getTableReplicationStatus(tableName).pipe(
            map(params => {
                let triggerStatusCode: number = params;
                console.log('triggerStatusCode', triggerStatusCode);
                switch (triggerStatusCode) {
                    case 0: {
                        return {"replicationStatus": false, "replicationStatusLabel": "Sync Off"};
                        }
                    case 1: {
                        return {"replicationStatus": false, "replicationStatusLabel": "Sync Partial"};
                        }
                    case 2: {
                        return {"replicationStatus": true, "replicationStatusLabel": "Sync On"};
                        }
                    }
                }
            )
        );
    }

}