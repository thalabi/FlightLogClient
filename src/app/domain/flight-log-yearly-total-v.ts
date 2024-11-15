export interface FlightLogYearlyTotalV {
    id: number;
    year: number;
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

    totalYear: number;

    _links: { self: { href: string } };
}
