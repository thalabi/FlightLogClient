export class FlightLog {
    id: number;
    flightDate: Date;
    makeModel: string;
	registration: string;
	pic: string;
	coPilot: string;
    routeFrom: string;
    routeTo: string;
    remarks: string;
    dayDual: number;
	daySolo: number;
	nightDual: number;
	nightSolo: number;

    instrumentSimulated: number;
    instrumentFlightSim: number;
    xcountryDay: number;
    xcountryNight: number;

    instrumentImc: number;
    instrumentNoIfrAppr: number;
    tosLdgsDay: number;
    tosLdgsNight: number;

    created: Date;
    modified: Date;
    
    _links: {flightLog: {href: string}};
    //created: Date;
}
