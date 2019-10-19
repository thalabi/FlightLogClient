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
    
    // componentHistorySet: Array<{
    //     // workPerformed: string;
    //     // datePerformed: Date;
    //     // hoursPerformed: number;
    //     name: string;
    //     description: string;
    //     workPerformed: string;
    //     datePerformed: Date;
    //     hoursPerformed: number;
    //     dateDue: Date;
    //     hoursDue: number;

    //     part: IGenericEntity;
    //     created: Date;
    //     modified: Date;
    
    //     _links: any;
    // }>;
    componentHistorySet: Array<AircraftComponentHistory>;


    created: Date;
    modified: Date;
    
    //_links: {component: {href: string}};
    _links: {self: {href: string}};
}
