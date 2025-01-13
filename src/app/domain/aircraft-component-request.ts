export namespace AircraftComponentRequest {

    export interface Component {
        componentUri: string;

        name: string;
        description: string;
        workPerformed: string;
        datePerformed: Date;
        hoursPerformed: number;
        dateDue: Date | null;
        hoursDue: number;

        partUri: string;

        historyRequestSet: Array<Historyrequest>;

        createHistoryRecord: boolean;

        created: Date;
        modified: Date;
    }

    export interface Historyrequest {
        historyUri: string;

        name: string;
        description: string;
        workPerformed: string;
        datePerformed: Date;
        hoursPerformed: number;
        dateDue: Date | null;
        hoursDue: number;

        partUri: string;

        created: Date;
        modified: Date;
    }
}