export interface FlightLogMonthlyTotalV {
    id: number;
    month: Date;
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

    totalMonth: number;

    _links: { self: { href: string } };
}
