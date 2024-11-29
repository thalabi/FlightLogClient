export interface FlightLogMonthlyTotalV {
    id: number;
    month: Date;
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

    totalMonth: number;

    _links: { self: { href: string } };
}
