export interface IFlightLogTotalsV {
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
    instrumentImc: number;
    instrumentSimulated: number;
    instrumentFlightSim: number;
    instrumentNoIfrAppr: number;
    xcountryDay: number;
    xcountryNight: number;
    tosLdgsDay: number;
    tosLdgsNight: number;

    toDateDayDual: number;
    toDateDaySolo: number;
    toDateNightDual: number;
    toDateNightSolo: number;
    toDateInstrumentImc: number;
    toDateInstrumentSimulated: number;
    toDateInstrumentFlightSim: number;
    toDateInstrumentNoIfrAppr: number;
    toDateXCountryDay: number;
    toDateXCountryNight: number;
    toDateTosLdgsDay: number;
    toDateTosLdgsNight: number;
    toDateTotal: number;

    monthDayDual: number;
    monthDaySolo: number;
    monthNightDual: number;
    monthNightSolo: number;
    monthInstrumentImc: number;
    monthInstrumentSimulated: number;
    monthInstrumentFlightSim: number;
    monthInstrumentNoIfrAppr: number;
    monthXCountryDay: number;
    monthXCountryNight: number;
    monthTosLdgsDay: number;
    monthTosLdgsNight: number;
    monthTotal: number;

    yearDayDual: number;
    yearDaySolo: number;
    yearNightDual: number;
    yearNightSolo: number;
    yearInstrumentImc: number;
    yearInstrumentSimulated: number;
    yearInstrumentFlightSim: number;
    yearInstrumentNoIfrAppr: number;
    yearXCountryDay: number;
    yearXCountryNight: number;
    yearTosLdgsDay: number;
    yearTosLdgsNight: number;
    yearTotal: number;

    _links: { flightLogTotalsV: { href: string } };
}