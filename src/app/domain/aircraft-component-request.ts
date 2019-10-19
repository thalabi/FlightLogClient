export namespace AircraftComponentRequest {

    export class Component {
        componentUri: string;

        name: string;
        description: string;
        workPerformed: string;
        datePerformed: Date;
        hoursPerformed: number;
        dateDue: Date;
        hoursDue: number;

        partUri: string;

        historyRequestSet: Array<Historyrequest>;
        
        createHistoryRecord: boolean;

        created: Date;
        modified: Date;
    }
    
    export class Historyrequest {
        historyUri: string;

        name: string;
        description: string;
        workPerformed: string;
        datePerformed: Date;
        hoursPerformed: number;
        dateDue: Date;
        hoursDue: number;
    
        partUri: string;

        created: Date;
        modified: Date;    
    }
}