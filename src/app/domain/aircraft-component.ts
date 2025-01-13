import { IGenericEntity } from "./i-gerneric-entity";
import { AircraftComponentHistory } from "./aircraft-component-history";

export interface AircraftComponent {
    name: string;
    description: string;
    workPerformed: string;
    datePerformed: Date;
    hoursPerformed: number;
    dateDue: Date | null;
    hoursDue: number;
    deleted: boolean;

    part: IGenericEntity;

    componentHistorySet: Array<AircraftComponentHistory>;

    created: Date;
    modified: Date;

    _links: { self: { href: string } };
}
