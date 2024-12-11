export interface FlightLogYearlyTotalV {
    id: number;
    year: Date;
    dayDual: number;
    daySolo: number;
    nightDual: number;
    nightSolo: number;

    instrumentSimulated: number;
    instrumentFlightSim: number;
    xCountryDay: number;
    xCountryNight: number;

    instrumentImc: number;
    instrumentNoIfrAppr: number;
    tosLdgsDay: number;
    tosLdgsNight: number;

    totalYear: number;

    _links: { self: { href: string } };
}
