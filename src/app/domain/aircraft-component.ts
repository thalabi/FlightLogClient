import { IGenericEntity } from "./i-gerneric-entity";
import { AircraftComponentHistory } from "./aircraft-component-history";

export class AircraftComponent {
    name: string;
    description: string;
    workPerformed: string;
    datePerformed: Date;
    hoursPerformed: number;
    dateDue: Date;
    hoursDue: number;
    deleted: boolean;

    part: IGenericEntity;
    
    componentHistorySet: Array<AircraftComponentHistory>;

    created: Date;
    modified: Date;
    
    _links: {self: {href: string}};
}
