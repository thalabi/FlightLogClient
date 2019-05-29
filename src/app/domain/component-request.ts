export class ComponentRequest {
    componentUri: string;
    name: string;
    description: string;
    workPerformed: string;
    datePerformed: Date;
    hoursPerformed: number;
    dateDue: Date;
    hoursDue: number;

    partUri: string;

    createHistoryRecord: boolean;

    created: Date;
    modified: Date;
}
