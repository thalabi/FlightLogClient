import { IGenericEntity } from "./i-gerneric-entity";

export interface AircraftComponentHistory {
    name: string;
    description: string;
    workPerformed: string;
    datePerformed: Date;
    hoursPerformed: number;
    dateDue: Date;
    hoursDue: number;

    part: IGenericEntity;
    created: Date;
    modified: Date;

    _links: any;
}
