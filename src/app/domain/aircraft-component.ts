import { IGenericEntity } from "./i-gerneric-entity";

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
    
    componentHistorySet: Array<{
        workPerformed: string;
        datePerformed: Date;
        hoursPerformed: number;
    }>;

    created: Date;
    modified: Date;
    
    _links: {component: {href: string}};
}
