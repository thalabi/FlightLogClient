export class FlightLogLastXDaysTotalV {
    id: number;
    days: number;
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
    
    _links: {self: {href: string}};
}
