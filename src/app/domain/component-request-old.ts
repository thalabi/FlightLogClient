import { AircraftComponentHistory } from "./aircraft-component-history";
import { IGenericEntity } from "./i-gerneric-entity";

export class ComponentRequestOld {
    componentUri: string;

    name: string;
    description: string;
    workPerformed: string;
    datePerformed: Date;
    hoursPerformed: number;
    dateDue: Date;
    hoursDue: number;

    partUri: string;

    componentHistoryRequestSet: Array<AircraftComponentHistory>;
    
    createHistoryRecord: boolean;

    created: Date;
    modified: Date;
}
